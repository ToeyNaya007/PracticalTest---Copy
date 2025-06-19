import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import { Trash2 } from "lucide-react"; // นำเข้าไอค่อนจาก lucide-react

export function DeleteUserConfirmation({ userId, onDelete }: { userId: string, onDelete: (userId: string) => void }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDelete = () => {
        onDelete(userId); // เรียกฟังก์ชันการลบผู้ใช้
        setIsDialogOpen(false); // ปิด Dialog หลังจากการลบ
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                {/* เพิ่มไอค่อน Trash2 ในปุ่มลบ */}
                <Button variant="ghost" className="text-red-600" onClick={() => setIsDialogOpen(true)}>
                    <Trash2 className=" h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-6 w-6" />
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </div>
                    <DialogDescription>
                        Are you sure you want to delete this userId {userId} ?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button className="bg-red-600 text-white hover:bg-red-700" onClick={handleDelete}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
