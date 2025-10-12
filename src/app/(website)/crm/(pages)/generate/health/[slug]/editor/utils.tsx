/* eslint-disable @typescript-eslint/no-explicit-any */
/* ---------- Small reusable UI ---------- */
/* ---------- shadcn/ui ---------- */
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";



export function LabeledInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-sm font-medium">{label}</div>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function SectionTable({
  title,
  headers,
  rows,
  renderRow,
  onAdd,
}: {
  title: string;
  headers: string[];
  rows: any[][];
  renderRow: (rowIdx: number) => React.ReactNode;
  onAdd: () => void;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">{title}</h2>
        <Button onClick={onAdd}>Add row</Button>
      </div>
      <Table className="border rounded-md">
        <TableHeader>
          <TableRow>
            {headers.map((h, i) => (
              <TableHead key={i}>{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((_, i) => (
            <TableRow key={i}>{renderRow(i)}</TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

export function ArrayTable({
  title,
  values,
  onChange,
}: {
  title: string;
  values: string[];
  onChange: (vals: string[]) => void;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{title}</h3>
        <Button onClick={() => onChange([...(values ?? []), ""])}>Add</Button>
      </div>
      <Table className="border rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead>Value</TableHead>
            <TableHead className="w-28"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(values ?? []).map((val, i) => (
            <TableRow key={i}>
              <TableCell>
                <Input
                  value={val}
                  onChange={(e) => {
                    const next = [...values];
                    next[i] = e.target.value;
                    onChange(next);
                  }}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  onClick={() => onChange(values.filter((_, idx) => idx !== i))}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

export function updateArray(arr: string[] | undefined, i: number, val: string) {
  const next = [...(arr ?? [])];
  next[i] = val;
  return next;
}