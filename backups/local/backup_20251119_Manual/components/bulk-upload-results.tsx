"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreatedCredential {
  email: string;
  password: string;
  name: string;
  id: string;
}

interface BulkUploadResultsProps {
  isOpen: boolean;
  onClose: () => void;
  results: {
    inserted: any[];
    skipped: any[];
    createdCredentials: CreatedCredential[];
  };
  summary: {
    total: number;
    inserted: number;
    skipped: number;
    createdCredentials: number;
  };
}

export function BulkUploadResults({
  isOpen,
  onClose,
  results,
  summary
}: BulkUploadResultsProps) {
  const [showPasswords, setShowPasswords] = useState(false);
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => new Set(prev).add(itemId));

      // Remove the checkmark after 2 seconds
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }, 2000);

      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy manually",
        variant: "destructive"
      });
    }
  };

  const copyAllCredentials = async () => {
    const allCredentials = results.createdCredentials
      .map(cred => `${cred.name} (${cred.email}): ${cred.password}`)
      .join('\n');

    await copyToClipboard(allCredentials, 'all');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Bulk Upload Results
          </DialogTitle>
          <DialogDescription>
            Review the results of your bulk contact upload
          </DialogDescription>
        </DialogHeader>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{summary.total}</div>
            <div className="text-sm text-blue-800">Total</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{summary.inserted}</div>
            <div className="text-sm text-green-800">Inserted</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">{summary.skipped}</div>
            <div className="text-sm text-orange-800">Skipped</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{summary.createdCredentials}</div>
            <div className="text-sm text-purple-800">New Users</div>
          </div>
        </div>

        {/* Created Credentials Section */}
        {results.createdCredentials && results.createdCredentials.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-green-700">✅ Created User Accounts</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPasswords(!showPasswords)}
                >
                  {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showPasswords ? 'Hide' : 'Show'} Passwords
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyAllCredentials}
                  className="flex items-center gap-1"
                >
                  <Copy className="w-4 h-4" />
                  Copy All
                </Button>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg mb-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <strong>Important:</strong> Save these credentials now. Passwords are shown only once for security.
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {results.createdCredentials.map((cred) => (
                <div key={cred.id} className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium text-green-900">{cred.name}</div>
                    <div className="text-sm text-green-700">User ID: {cred.id.slice(0, 8)}...</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Email */}
                    <div>
                      <Label className="text-xs text-green-700">Email</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={cred.email}
                          readOnly
                          className="bg-white font-mono text-sm"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(cred.email, `email-${cred.id}`)}
                          className="shrink-0"
                        >
                          {copiedItems.has(`email-${cred.id}`) ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <Label className="text-xs text-green-700">Password</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type={showPasswords ? "text" : "password"}
                          value={cred.password}
                          readOnly
                          className="bg-white font-mono text-sm"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(cred.password, `password-${cred.id}`)}
                          className="shrink-0"
                        >
                          {copiedItems.has(`password-${cred.id}`) ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Copy Both Button */}
                  <div className="mt-3 flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(`${cred.email}:${cred.password}`, `both-${cred.id}`)}
                    >
                      {copiedItems.has(`both-${cred.id}`) ? (
                        <Check className="w-4 h-4 mr-1 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 mr-1" />
                      )}
                      Copy Email:Password
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skipped Records Section */}
        {results.skipped && results.skipped.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-700">⚠️ Skipped Records</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {results.skipped.map((skipped, index) => (
                <div key={index} className="bg-orange-50 border border-orange-200 p-3 rounded">
                  <div className="font-medium text-orange-900">{skipped.contact.name}</div>
                  <div className="text-sm text-orange-700">{skipped.reason}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              // Print functionality could be added here
              window.print();
            }}
          >
            Print Results
          </Button>
          <Button onClick={onClose}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
