"use client";

import { useState, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, FileText, Loader2, AlertCircle } from "lucide-react";
import Papa from "papaparse";

export default function BulkOperations() {
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [uploadResults, setUploadResults] = useState<{
    success: number;
    duplicates: string[];
    errors: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File",
        description: "Please select a CSV file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadResults(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const contacts = results.data as any[];
          const requiredHeaders = ['Name', 'Department', 'Designation', 'Phone Number', 'Extension', 'Email', 'Location', 'Institution'];
          
          // Validate headers
          const headers = Object.keys(contacts[0] || {});
          const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
          
          if (missingHeaders.length > 0) {
            toast({
              title: "Invalid CSV Format",
              description: `Missing headers: ${missingHeaders.join(', ')}`,
              variant: "destructive",
            });
            setUploading(false);
            return;
          }

          const response = await fetch('/api/bulk-upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(contacts),
          });

          const data = await response.json();

          if (response.ok) {
            setUploadResults(data);
            toast({
              title: "Upload Complete",
              description: `${data.success} contacts added successfully`,
            });
          } else {
            toast({
              title: "Upload Error",
              description: data.error || "An unknown error occurred",
              variant: "destructive",
            });
          }

        } catch (error: any) {
          toast({
            title: "Upload Error",
            description: error.message,
            variant: "destructive",
          });
        } finally {
          setUploading(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      },
      error: (error) => {
        toast({
          title: "CSV Parse Error",
          description: error.message,
          variant: "destructive",
        });
        setUploading(false);
      }
    });
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const { data: contacts, error } = await supabase
        .from("contacts")
        .select("*")
        .order("name");

      if (error) throw error;

      const csvData = contacts?.map(contact => ({
        Name: contact.name,
        Department: contact.department,
        Designation: contact.designation,
        'Phone Number': contact.phone_number,
        Extension: contact.extension,
        Email: contact.email,
        Location: contact.location,
        Institution: contact.institution,
      })) || [];

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `telephone_directory_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download Complete",
        description: `${contacts?.length || 0} contacts exported to CSV`,
      });
    } catch (error: any) {
      toast({
        title: "Download Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload CSV */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload CSV
            </CardTitle>
            <CardDescription>
              Upload contacts in bulk via CSV file. Duplicates will be skipped automatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  variant="outline"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Select CSV File
                    </>
                  )}
                </Button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                CSV must include: Name, Department, Designation, Phone Number, Extension, Email, Location, Institution
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Download CSV */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Download CSV
            </CardTitle>
            <CardDescription>
              Export all contacts to a CSV file for backup or external use.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-6">
              <Download className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <Button
                  onClick={handleDownload}
                  disabled={downloading}
                >
                  {downloading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download All Contacts
                    </>
                  )}
                </Button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Downloads all contacts in the standard CSV format
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Results */}
      {uploadResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Upload Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{uploadResults.success}</div>
                <div className="text-sm text-green-700">Contacts Added</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{uploadResults.duplicates.length}</div>
                <div className="text-sm text-yellow-700">Duplicates Skipped</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{uploadResults.errors.length}</div>
                <div className="text-sm text-red-700">Errors</div>
              </div>
            </div>

            {uploadResults.duplicates.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-yellow-800 mb-2">Duplicates Skipped:</h4>
                <div className="bg-yellow-50 p-3 rounded-md max-h-32 overflow-y-auto">
                  {uploadResults.duplicates.map((duplicate, index) => (
                    <div key={index} className="text-sm text-yellow-700">{duplicate}</div>
                  ))}
                </div>
              </div>
            )}

            {uploadResults.errors.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-red-800 mb-2">Errors:</h4>
                <div className="bg-red-50 p-3 rounded-md max-h-32 overflow-y-auto">
                  {uploadResults.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-700">{error}</div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}