import { useState } from "react";
import { ChevronUp, ChevronDown, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Reference {
  id: string;
  curve: string;
  quantity: number;
  warehouseEntry: string;
  capsuleLaunch: string;
  unlockDate: string;
  unlockedDays: number;
}

const mockData: Reference[] = [
  {
    id: "7xjQXii5bZiVniqX9ZCP",
    curve: "XS-S-M-L-XL",
    quantity: 75,
    warehouseEntry: "20 sep 2025",
    capsuleLaunch: "10 sep 2025",
    unlockDate: "11 oct 2025",
    unlockedDays: 26
  }
];

type SortField = keyof Reference;
type SortDirection = 'asc' | 'desc';

const ReferenceTable = () => {
  const [data, setData] = useState<Reference[]>(mockData);
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('all');
  const [dayFilter, setDayFilter] = useState('all');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp className="h-4 w-4 text-muted-foreground/50" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-muted-foreground" /> : 
      <ChevronDown className="h-4 w-4 text-muted-foreground" />;
  };

  const filteredAndSortedData = data
    .filter(item => {
      if (searchTerm && !item.id.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      const aStr = String(aValue);
      const bStr = String(bValue);
      return sortDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Detalles de la Referencia
        </h2>
        
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filtrar por ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={monthFilter} onValueChange={setMonthFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Todos los Meses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Meses</SelectItem>
              <SelectItem value="september">Septiembre</SelectItem>
              <SelectItem value="october">Octubre</SelectItem>
              <SelectItem value="november">Noviembre</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dayFilter} onValueChange={setDayFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Todos los Días" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Días</SelectItem>
              <SelectItem value="1-7">1-7 días</SelectItem>
              <SelectItem value="8-15">8-15 días</SelectItem>
              <SelectItem value="16-30">16-30 días</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-table-header">
            <tr>
              <th className="px-6 py-3 text-left">
                <button 
                  onClick={() => handleSort('id')}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  ID
                  <SortIcon field="id" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button 
                  onClick={() => handleSort('curve')}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  Curva
                  <SortIcon field="curve" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button 
                  onClick={() => handleSort('quantity')}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  Cantidad
                  <SortIcon field="quantity" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button 
                  onClick={() => handleSort('warehouseEntry')}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  Ingreso a Bodega
                  <SortIcon field="warehouseEntry" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button 
                  onClick={() => handleSort('capsuleLaunch')}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  Lanzamiento Cápsula
                  <SortIcon field="capsuleLaunch" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button 
                  onClick={() => handleSort('unlockDate')}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  Fecha Desbloqueo
                  <SortIcon field="unlockDate" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button 
                  onClick={() => handleSort('unlockedDays')}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  Días Desbloqueado
                  <SortIcon field="unlockedDays" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-sm font-medium text-foreground">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.map((item) => (
              <tr key={item.id} className="border-b border-border hover:bg-table-hover transition-colors">
                <td className="px-6 py-4 text-sm font-mono text-foreground">
                  {item.id}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {item.curve}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {item.warehouseEntry}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {item.capsuleLaunch}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {item.unlockDate}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                    {item.unlockedDays}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Issue indicator */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-xs font-medium">
            N
          </div>
          <span className="text-sm text-muted-foreground">1 Issue</span>
          <button className="ml-2 text-destructive hover:text-destructive/80 text-sm">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferenceTable;