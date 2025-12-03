"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Contact } from "@/lib/types";
import { contactService } from "@/lib/database";

interface ContactFormProps {
  mode: "add" | "edit";
  contact?: Contact;
  onSuccess?: () => void;
}

export default function ContactForm({ mode, contact, onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: contact?.name || "",
    department: contact?.department || "",
    designation: contact?.designation || "",
    phone_number: contact?.phone_number || "",
    extension: contact?.extension || "",
    email: contact?.email || "",
    location: contact?.location || "",
    institution: contact?.institution || "ACTREC",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "add") {
        const { data, error } = await contactService.createContact(formData);

        if (error) {
          throw new Error(error);
        }

        toast({
          title: "Contact Added",
          description: `${formData.name} has been added to the directory.`,
        });

        // Reset form
        setFormData({
          name: "",
          department: "",
          designation: "",
          phone_number: "",
          extension: "",
          email: "",
          location: "",
          institution: "ACTREC",
        });
      } else {
        // Edit mode
        const { error } = await contactService.updateContact(contact!.id, formData);

        if (error) {
          throw new Error(error);
        }

        toast({
          title: "Contact Updated",
          description: `${formData.name} has been updated successfully.`,
        });
      }

      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="DR. PRASHANT BHAT"
            required
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department *</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => handleInputChange("department", e.target.value)}
            placeholder="Medical Administration"
            required
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="designation">Designation *</Label>
          <Input
            id="designation"
            value={formData.designation}
            onChange={(e) => handleInputChange("designation", e.target.value)}
            placeholder="Doctor"
            required
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone_number">Phone Number *</Label>
          <Input
            id="phone_number"
            value={formData.phone_number}
            onChange={(e) => handleInputChange("phone_number", e.target.value)}
            placeholder="-7671"
            required
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="extension">Extension *</Label>
          <Input
            id="extension"
            value={formData.extension}
            onChange={(e) => handleInputChange("extension", e.target.value)}
            placeholder="5042"
            required
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="prashant.bhat@actrec.gov.in"
            required
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="Second Floor"
            required
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="institution">Institution *</Label>
          <Input
            id="institution"
            value={formData.institution}
            onChange={(e) => handleInputChange("institution", e.target.value)}
            placeholder="ACTREC"
            required
            disabled={loading}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === "add" ? "Adding..." : "Updating..."}
            </>
          ) : (
            mode === "add" ? "Add Contact" : "Update Contact"
          )}
        </Button>
      </div>
    </form>
  );
}