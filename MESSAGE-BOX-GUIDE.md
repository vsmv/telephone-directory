# Message Box & Toast Guide

## Quick Reference for All Action Feedback

### 🎯 Toast Message Types

#### ✅ Success Messages (Green)
```
Duration: 3 seconds
Icon: ✅ CheckCircle2
Color: Green

Examples:
✅ Success
   Learning plan added successfully

✅ Success  
   Patentable idea updated successfully

✅ User Updated
   User information has been successfully updated

✅ Copied!
   Password copied to clipboard
```

#### ❌ Error Messages (Red)
```
Duration: 5 seconds
Icon: ❌ X or AlertCircle
Color: Red
Variant: destructive

Examples:
❌ Error Loading Plans
   Not authenticated

❌ Error Updating Idea
   Forbidden: You can only edit your own ideas

❌ Error Deleting Plan
   HTTP 403
```

#### ⚠️ Warning Messages (Amber)
```
Duration: 3 seconds
Icon: ⚠️ AlertTriangle
Color: Amber
Variant: destructive

Examples:
⚠️ Validation Error
   Title is required

⚠️ No Selection
   Please select users to reset passwords

⚠️ Cannot Remove Last Admin
   At least one administrator must remain
```

---

## 🔐 Password Reset Dialogs

### Single User Password Reset

```
┌─────────────────────────────────────────┐
│ ✅ Password Reset Successful            │
│                                         │
│ New password has been generated.        │
│ Please copy and share securely.         │
│                                         │
│ ┌─────────────────────────────────┐   │
│ │ User Email                       │   │
│ │ user@actrec.gov.in              │   │
│ │                                  │   │
│ │ New Password                     │   │
│ │ ┌──────────────────┐  [Copy]   │   │
│ │ │ Xy9#mK2$pL4@nQ8 │            │   │
│ │ └──────────────────┘            │   │
│ └─────────────────────────────────┘   │
│                                         │
│ ⚠️ Important: This password will only  │
│    be shown once. Copy before closing. │
│                                         │
│         [Copy Password]  [Done]         │
└─────────────────────────────────────────┘
```

**Features:**
- Monospace font for password clarity
- Copy button next to password field
- Copy button in footer
- Warning message
- One-click copy to clipboard

---

### Bulk Password Reset

```
┌──────────────────────────────────────────────┐
│ ✅ Bulk Password Reset Complete              │
│                                              │
│ 3 passwords have been reset.                 │
│                                              │
│ ┌──────────────────────────────────────┐   │
│ │ User 1                               │   │
│ │ user1@actrec.gov.in                 │   │
│ │ ┌────────────────┐  [Copy]         │   │
│ │ │ Xy9#mK2$pL4@nQ8│                 │   │
│ │ └────────────────┘                  │   │
│ ├──────────────────────────────────────┤   │
│ │ User 2                               │   │
│ │ user2@actrec.gov.in                 │   │
│ │ ┌────────────────┐  [Copy]         │   │
│ │ │ Pq7!nM3#kL9$rT2│                 │   │
│ │ └────────────────┘                  │   │
│ ├──────────────────────────────────────┤   │
│ │ User 3                               │   │
│ │ user3@actrec.gov.in                 │   │
│ │ ┌────────────────┐  [Copy]         │   │
│ │ │ Zx4@mN8!pK6#qL1│                 │   │
│ │ └────────────────┘                  │   │
│ └──────────────────────────────────────┘   │
│                                              │
│ ⚠️ Important: These passwords will only     │
│    be shown once. Copy before closing.      │
│                                              │
│      [Copy All Passwords]  [Done]            │
└──────────────────────────────────────────────┘
```

**Features:**
- Scrollable list for many users
- Individual copy buttons
- "Copy All" button (formatted list)
- Mobile-responsive
- Clear user identification

**Copy All Format:**
```
user1@actrec.gov.in: Xy9#mK2$pL4@nQ8
user2@actrec.gov.in: Pq7!nM3#kL9$rT2
user3@actrec.gov.in: Zx4@mN8!pK6#qL1
```

---

## 📱 User Interaction Flow

### Adding a Learning Plan

```
1. User fills form
   ↓
2. Clicks "Add Plan"
   ↓
3a. Success Path:
    → ✅ Success toast (3s)
    → "Learning plan added successfully"
    → Form clears
    → Plan appears in list
    
3b. Error Path:
    → ❌ Error toast (5s)
    → "Error Adding Plan - [reason]"
    → Form stays filled
    → User can retry
    
3c. Validation Path:
    → ⚠️ Warning toast (3s)
    → "Validation Error - Title is required"
    → Form stays filled
    → User fixes and retries
```

### Resetting Password (Single)

```
1. User clicks "Reset Password" button
   ↓
2. System generates password
   ↓
3. Dialog opens with password
   ↓
4. User clicks copy button
   ↓
5. ✅ "Copied!" toast (2s)
   ↓
6. Password in clipboard
   ↓
7. User clicks "Done"
   ↓
8. Dialog closes
```

### Resetting Passwords (Bulk)

```
1. User selects multiple users (checkboxes)
   ↓
2. Clicks "Reset Selected Passwords"
   ↓
3. System generates all passwords
   ↓
4. Dialog opens with scrollable list
   ↓
5a. Copy Individual:
    → Click copy button for one user
    → ✅ "Copied!" toast (2s)
    → That password in clipboard
    
5b. Copy All:
    → Click "Copy All Passwords"
    → ✅ "Copied!" toast (2s)
    → All passwords in clipboard (formatted)
    
6. User clicks "Done"
   ↓
7. Dialog closes
   ↓
8. Selection cleared
```

---

## 🎨 Visual Design

### Toast Position
```
┌─────────────────────────────────┐
│                                 │
│         Application             │
│                                 │
│                                 │
│                    ┌──────────┐ │
│                    │ ✅ Toast │ │ ← Top-right corner
│                    │ Message  │ │
│                    └──────────┘ │
│                                 │
└─────────────────────────────────┘
```

### Dialog Position
```
┌─────────────────────────────────┐
│         [Overlay]               │
│                                 │
│    ┌─────────────────────┐     │
│    │                     │     │ ← Centered
│    │      Dialog         │     │
│    │                     │     │
│    └─────────────────────┘     │
│                                 │
└─────────────────────────────────┘
```

---

## 🔧 Implementation Code Examples

### Success Toast
```typescript
toast({
  title: '✅ Success',
  description: 'Learning plan added successfully',
  duration: 3000
});
```

### Error Toast
```typescript
toast({
  title: '❌ Error Loading Plans',
  description: error instanceof Error ? error.message : 'Unknown error',
  variant: 'destructive',
  duration: 5000
});
```

### Warning Toast
```typescript
toast({
  title: '⚠️ Validation Error',
  description: 'Title is required',
  variant: 'destructive',
  duration: 3000
});
```

### Copy to Clipboard
```typescript
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast({
      title: '✅ Copied!',
      description: 'Password copied to clipboard',
      duration: 2000
    });
  } catch (error) {
    toast({
      title: 'Copy Failed',
      description: 'Please copy manually',
      variant: 'destructive'
    });
  }
};
```

---

## ✨ Best Practices

### Do's ✅
- Use appropriate icons for message types
- Keep success messages brief (3s)
- Give more time for errors (5s)
- Show passwords in dialogs, not toasts
- Provide copy buttons for passwords
- Warn about one-time password display
- Confirm clipboard operations
- Use descriptive error messages

### Don'ts ❌
- Don't show passwords in toasts
- Don't use generic error messages
- Don't make success messages too long
- Don't auto-close password dialogs
- Don't log passwords to console
- Don't skip confirmation messages
- Don't use inconsistent durations
- Don't forget accessibility

---

## 📊 Message Duration Guide

| Message Type | Duration | Reason |
|-------------|----------|---------|
| Success | 3 seconds | Quick confirmation |
| Error | 5 seconds | More time to read details |
| Warning | 3 seconds | Quick validation feedback |
| Copy Confirm | 2 seconds | Instant feedback |
| Info | 4 seconds | Moderate reading time |

---

## 🎯 Summary

**Every action now has clear feedback:**
- ✅ Success = Green checkmark + 3s
- ❌ Error = Red X + 5s + details
- ⚠️ Warning = Amber triangle + 3s
- 📋 Copy = Instant confirmation
- 🔐 Passwords = Copyable dialogs

**User benefits:**
- Know immediately if action succeeded
- Understand what went wrong
- Easy password management
- Professional, polished experience
- Accessible to all users
