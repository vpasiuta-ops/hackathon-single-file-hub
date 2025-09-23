import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface PartnerModalProps {
  children: React.ReactNode;
}

export default function PartnerModal({ children }: PartnerModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    description: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    toast({
      title: "Заявку надіслано!",
      description: "Ми зв'яжемось з вами найближчим часом.",
    });
    
    setFormData({ name: "", contact: "", description: "" });
    setIsOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Стати партнером</DialogTitle>
          <DialogDescription>
            Заповніть форму, і ми зв'яжемось з вами для обговорення співпраці.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Назва організації</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Введіть назву вашої організації"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact">Контактні дані</Label>
            <Input
              id="contact"
              type="email"
              value={formData.contact}
              onChange={(e) => handleInputChange("contact", e.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Як хочете долучитись</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Опишіть, як ви хочете долучитися до платформи"
              className="min-h-[80px]"
              required
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Надіслати заявку
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Скасувати
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}