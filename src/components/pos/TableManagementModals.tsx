import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Table, Floor } from '@/types/pos';
import { usePOS } from '@/hooks/use-pos';

interface TableManagementModalsProps {
    floors: Floor[];
    activeModal: 'add' | 'edit' | 'delete' | null;
    onClose: () => void;
    selectedTable: Table | null;
    currentFloorId: string;
}

export const TableManagementModals = ({
    floors,
    activeModal,
    onClose,
    selectedTable,
    currentFloorId
}: TableManagementModalsProps) => {
    const { addTable, updateTable, deleteTable } = usePOS();

    // Form State
    const [tableNumber, setTableNumber] = useState('');
    const [floorId, setFloorId] = useState(currentFloorId);
    const [seats, setSeats] = useState('4');

    // Reset form when modal opens/changes
    useEffect(() => {
        if (activeModal === 'add') {
            setTableNumber('');
            setFloorId(currentFloorId);
            setSeats('4');
        } else if (activeModal === 'edit' && selectedTable) {
            setTableNumber(selectedTable.number.toString());
            setFloorId(selectedTable.floor || currentFloorId);
            setSeats(selectedTable.seats?.toString() || '4');
        }
    }, [activeModal, selectedTable, currentFloorId]);

    const handleSave = async () => {
        if (activeModal === 'add') {
            await addTable({
                number: parseInt(tableNumber),
                floor: floorId,
                seats: parseInt(seats)
            });
        } else if (activeModal === 'edit' && selectedTable) {
            await updateTable(selectedTable.id, {
                number: parseInt(tableNumber),
                floor: floorId,
                seats: parseInt(seats)
            });
        }
        onClose();
    };

    const handleDelete = async () => {
        if (selectedTable) {
            await deleteTable(selectedTable.id);
            onClose();
        }
    };

    return (
        <>
            {/* Add/Edit Modal */}
            <Dialog open={activeModal === 'add' || activeModal === 'edit'} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{activeModal === 'add' ? 'Add New Table' : 'Edit Table'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="number" className="text-right">
                                Number
                            </Label>
                            <Input
                                id="number"
                                type="number"
                                value={tableNumber}
                                onChange={(e) => setTableNumber(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="floor" className="text-right">
                                Floor
                            </Label>
                            <Select value={floorId} onValueChange={setFloorId}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select Floor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {floors.map(f => (
                                        <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="seats" className="text-right">Seats</Label>
                            <Input
                                id="seats"
                                type="number"
                                value={seats}
                                onChange={(e) => setSeats(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSave}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={activeModal === 'delete'} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Delete Table</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>Are you sure you want to delete Table <b>{selectedTable?.number}</b>?</p>
                        <p className="text-sm text-muted-foreground mt-2">This action cannot be undone.</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
