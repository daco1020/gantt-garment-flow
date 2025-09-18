import Header from "@/components/Header";
import GanttChart from "@/components/GanttChart";
import ReferenceTable from "@/components/ReferenceTable";
import { LaunchDateProvider } from "@/contexts/LaunchDateContext";

const Index = () => {
  return (
    <LaunchDateProvider>
      <div className="min-h-screen bg-gantt-background">
        <Header />
        
        <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          <GanttChart items={[]} />
          <ReferenceTable />
        </main>
      </div>
    </LaunchDateProvider>
  );
};

export default Index;
