import Header from "@/components/Header";
import GanttChart from "@/components/GanttChart";
import ReferenceTable from "@/components/ReferenceTable";

const Index = () => {
  return (
    <div className="min-h-screen bg-gantt-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <GanttChart items={[]} />
        <ReferenceTable />
      </main>
    </div>
  );
};

export default Index;
