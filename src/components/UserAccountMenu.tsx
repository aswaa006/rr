import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, BookOpen, LogOut, Settings } from "lucide-react";

interface UserAccountMenuProps {
  userType: "student" | "hero";
  userName: string;
  onLogout: () => void;
}

const UserAccountMenu = ({ userType, userName, onLogout }: UserAccountMenuProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{userName}</p>
            <p className="w-[200px] truncate text-sm text-muted-foreground">
              {userType === "student" ? "Student" : "Hero Driver"}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        
        {userType === "student" ? (
          <>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BookOpen className="mr-2 h-4 w-4" />
              <span>My Bookings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Driver Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BookOpen className="mr-2 h-4 w-4" />
              <span>Trip History</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Vehicle Settings</span>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountMenu;