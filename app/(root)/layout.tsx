"use client";

import Link from "next/link";
import Image from "next/image";
import { ReactNode, useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Home,
  FileText,
  Settings,
  LogOut,
  User,
  BarChart3,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import Aurora from '../../components/Aurora';

import { getCurrentUser } from "@/lib/actions/auth.action";
import { isAuthenticated } from "@/lib/actions/auth.action"

const Layout =  ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isUserAuthenticated = await isAuthenticated();
      if (!isUserAuthenticated) {
        redirect("/sign-in");
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);


  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);
  

  useEffect(() => {
    const handleScroll = () => {
      // Only change style when scrolled past 50px
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }



  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Aurora Background - Fixed and covering entire viewport */}
      <div className="fixed inset-0 z-0 h-[200%]">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.4}
          amplitude={1.2}
          speed={0.5}
        />
      </div>
      
      {/* Semi-transparent overlay for better content readability */}
      <div className="fixed inset-0 z-1 bg-gradient-to-br from-gray-50/70 to-gray-100/70 dark:from-gray-900/70 dark:to-gray-800/70 backdrop-blur-sm"></div>
      
      {/* Content Container - Relative positioning to appear above Aurora */}
      <div className="relative z-10 min-h-screen">
        {/* Elegant Animated Header */}
        <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-out ${
          isScrolled 
            ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-sm py-3 border-b border-gray-200/30 dark:border-gray-700/30' 
            : 'bg-transparent backdrop-blur-none py-6 border-b border-transparent'
        }`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {/* Logo and Brand */}
              <div className="flex items-center space-x-3">
                <Link href="/" className="flex items-center gap-2">
                  <div className="relative">
                    <div className={`absolute inset-0 bg-indigo-500 rounded-full blur-md transition-all duration-500 ${
                      isScrolled ? 'opacity-0 scale-90' : 'opacity-30 scale-100'
                    }`}></div>
                    <Image 
                      src="/logo.svg" 
                      alt="DevPrep Logo" 
                      width={isScrolled ? 34 : 38} 
                      height={isScrolled ? 30 : 32} 
                      className="relative transition-all duration-500"
                    />
                  </div>
                  <h2 className={`font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent transition-all duration-500 ${
                    isScrolled ? 'text-lg' : 'text-xl'
                  }`}>
                    DevPrep
                  </h2>
                </Link>
              </div>
              
              {/* Navigation Links - Hidden on mobile */}
              <nav className="hidden md:flex items-center space-x-6">
                {/* Navigation links are commented out as in the original code */}
              </nav>
              
              {/* User Profile */}
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <Button variant="ghost" className={`relative rounded-full p-0 transition-all duration-500 ${
                    isScrolled ? 'h-10 w-10' : 'h-11 w-11'
                  } hover:bg-indigo-50 dark:hover:bg-indigo-900/30`}>
                    <div className={`rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center border-2 border-indigo-200 dark:border-indigo-800 transition-all duration-500 ${
                      isScrolled ? 'h-10 w-10' : 'h-11 w-11'
                    }`}>
                      <User className={`text-indigo-600 dark:text-indigo-400 transition-all duration-500 ${
                        isScrolled ? 'h-5 w-5' : 'h-6 w-6'
                      }`} />
                    </div>
                  </Button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-3 w-56 origin-top-right bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-1 z-50 border border-gray-200/50 dark:border-gray-700/50">
                    <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'User Name'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
                    </div>
                    <div className="py-1">
                      <DropdownItem href="/profile" icon={<User className="h-4 w-4" />}>
                        Profile
                      </DropdownItem>
                      <DropdownItem href="/settings" icon={<Settings className="h-4 w-4" />}>
                        Settings
                      </DropdownItem>
                      <div className="border-t border-gray-200/50 dark:border-gray-700/50 my-1"></div>
                        <button
                        onClick={async () => {
                          try {
                          // Clear any auth tokens or session data
                          localStorage.removeItem('token'); // if you use token-based auth
                          sessionStorage.clear();
                          
                          // Redirect to sign-in page
                          window.location.href = '/sign-in';
                          } catch (error) {
                          console.error('Logout error:', error);
                          }
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                        >
                        <span className="mr-3 text-gray-500 dark:text-gray-400">
                          <LogOut className="h-4 w-4" />
                        </span>
                        Log out
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Subtle progress indicator that appears on scroll */}
          {/* <div className={`h-0.5 w-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700 ${
            isScrolled ? 'opacity-100' : 'opacity-0'
          }`}></div> */}
        </header>
        
        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <div className="grid grid-cols-5 gap-1 p-2">
            <MobileNavLink href="/" icon={<Home size={20} />} label="Home" />
            <MobileNavLink href="/interviews" icon={<FileText size={20} />} label="Interviews" />
            <MobileNavLink href="/resources" icon={<BookOpen size={20} />} label="Resources" />
            <MobileNavLink href="/analytics" icon={<BarChart3 size={20} />} label="Analytics" />
            <MobileNavLink href="/profile" icon={<User size={20} />} label="Profile" />
          </div>
        </div>
        
        {/* Main Content - Fixed padding to maintain consistent spacing */}
        <main className="container mx-auto px-4 pt-28 pb-24 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
};

// Navigation Link Component
const NavLink = ({ 
  href, 
  icon, 
  children 
}: { 
  href: string; 
  icon: React.ReactNode; 
  children: React.ReactNode 
}) => (
  <Link 
    href={href}
    className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 backdrop-blur-sm"
  >
    <span className="mr-2 text-indigo-500 dark:text-indigo-400">{icon}</span>
    {children}
  </Link>
);

// Mobile Navigation Link Component
const MobileNavLink = ({ 
  href, 
  icon, 
  label 
}: { 
  href: string; 
  icon: React.ReactNode; 
  label: string 
}) => (
  <Link 
    href={href}
    className="flex flex-col items-center justify-center p-3 rounded-xl text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 backdrop-blur-sm"
  >
    <div className="text-indigo-500 dark:text-indigo-400">{icon}</div>
    <span className="text-xs mt-1">{label}</span>
  </Link>
);

// Dropdown Item Component
const DropdownItem = ({ 
  href, 
  icon, 
  children 
}: { 
  href: string; 
  icon: React.ReactNode; 
  children: React.ReactNode 
}) => (
  <Link 
    href={href}
    className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
  >
    <span className="mr-3 text-gray-500 dark:text-gray-400">{icon}</span>
    {children}
  </Link>
);

export default Layout;