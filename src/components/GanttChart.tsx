import { useEffect, useRef } from "react";

interface GanttItem {
  id: string;
  start: Date;
  end: Date;
  progress: number;
}

interface GanttChartProps {
  items: GanttItem[];
}

const GanttChart = ({ items }: GanttChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  // Generate timeline dates
  const generateTimeline = () => {
    const dates = [];
    const startDate = new Date(2025, 8, 20); // Sep 20, 2025
    for (let i = 0; i < 24; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const timeline = generateTimeline();
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      month: 'short', 
      day: 'numeric' 
    }).replace('.', '');
  };

  const calculatePosition = (date: Date) => {
    const startDate = timeline[0];
    const endDate = timeline[timeline.length - 1];
    const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const daysSinceStart = (date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    return (daysSinceStart / totalDays) * 100;
  };

  const sampleItems = items.length > 0 ? items : [
    {
      id: "XiI5bZiVniqX9ZCP",
      start: new Date(2025, 8, 22),
      end: new Date(2025, 9, 13),
      progress: 65
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold text-foreground mb-6">
        Resumen de la Cronología
      </h2>
      
      <div className="space-y-6">
        {/* Timeline */}
        <div className="relative">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            {timeline.filter((_, i) => i % 6 === 0).map((date, i) => (
              <span key={i}>{formatDate(date)}</span>
            ))}
          </div>
          
          {/* Gantt bars */}
          <div className="relative h-8 bg-gantt-background rounded border border-border">
            {sampleItems.map((item) => {
              const startPos = calculatePosition(item.start);
              const endPos = calculatePosition(item.end);
              const width = endPos - startPos;
              
              return (
                <div key={item.id} className="absolute top-1 bottom-1 flex items-center">
                  <div 
                    className="h-full bg-gantt-primary rounded-sm shadow-sm"
                    style={{
                      left: `${startPos}%`,
                      width: `${width}%`
                    }}
                  />
                  <span 
                    className="absolute text-xs font-medium text-muted-foreground whitespace-nowrap"
                    style={{
                      left: `${startPos - 8}%`,
                      top: '-20px'
                    }}
                  >
                    {item.id}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
            <div className="w-3 h-3 bg-foreground rounded-sm"></div>
            <span>Tiempo hasta Lanzamiento</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;