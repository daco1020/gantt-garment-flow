import { useEffect, useState } from "react";
import Header from "@/components/Header";
import GanttChart from "@/components/GanttChart";
import ReferenceTable from "@/components/ReferenceTable";
import { LaunchDateProvider, useLaunchDate } from "@/contexts/LaunchDateContext";
import { supabase } from "@/integrations/supabase/client";

interface Reference {
  id: string;
  referencia: string;
  fecha_desbloqueo: string | null;
  lanzamiento_capsula: string | null;
  dias_desbloqueado: number;
}

const IndexContent = () => {
  const [ganttItems, setGanttItems] = useState<Array<{
    id: string;
    start: Date;
    end: Date;
    progress: number;
  }>>([]);
  const { launchDate } = useLaunchDate();

  useEffect(() => {
    fetchReferences();
    
    // Subscribe to real-time changes
    const channel = supabase
      .channel('gantt-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'references'
        },
        () => {
          fetchReferences();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [launchDate]);

  const fetchReferences = async () => {
    const { data, error } = await supabase
      .from('references')
      .select('id, referencia, fecha_desbloqueo, lanzamiento_capsula, dias_desbloqueado')
      .order('fecha_desbloqueo', { ascending: true });

    if (error) {
      console.error('Error fetching references:', error);
      return;
    }

    if (data) {
      const items = data
        .filter(ref => ref.fecha_desbloqueo && ref.lanzamiento_capsula)
        .map(ref => {
          const unlockDate = new Date(ref.fecha_desbloqueo!);
          const launchDateObj = new Date(ref.lanzamiento_capsula!);
          
          // Calculate progress based on current date
          const now = new Date();
          const totalDays = (launchDateObj.getTime() - unlockDate.getTime()) / (1000 * 60 * 60 * 24);
          const daysPassed = (now.getTime() - unlockDate.getTime()) / (1000 * 60 * 60 * 24);
          const progress = Math.max(0, Math.min(100, (daysPassed / totalDays) * 100));

          return {
            id: ref.referencia,
            start: unlockDate,
            end: launchDateObj,
            progress: Math.round(progress)
          };
        });

      setGanttItems(items);
    }
  };

  return (
    <div className="min-h-screen bg-gantt-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <GanttChart items={ganttItems} />
        <ReferenceTable />
      </main>
    </div>
  );
};

const Index = () => {
  return (
    <LaunchDateProvider>
      <IndexContent />
    </LaunchDateProvider>
  );
};

export default Index;
