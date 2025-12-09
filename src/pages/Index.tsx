import Header from "@/components/Header";
import ReferenceTable from "@/components/ReferenceTable";
import { LaunchDateProvider } from "@/contexts/LaunchDateContext";

const IndexContent = () => {
  return (
    <div className="min-h-screen bg-gantt-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
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
