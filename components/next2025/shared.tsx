'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Next2025HeaderProps {
  children: ReactNode;
  className?: string;
}

export function Next2025Header({ children, className }: Next2025HeaderProps) {
  return (
    <div className={cn(
      "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="container flex h-16 items-center justify-between px-4">
        {children}
      </div>
    </div>
  );
}

interface Next2025CardProps {
  children: ReactNode;
  className?: string;
  gradient?: boolean;
}

export function Next2025Card({ children, className, gradient = false }: Next2025CardProps) {
  return (
    <div className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      gradient && "aurora border-0",
      className
    )}>
      {children}
    </div>
  );
}

interface Next2025StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  variant?: 'default' | 'points' | 'victories' | 'rank';
}

export function Next2025StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon,
  variant = 'default'
}: Next2025StatsCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border bg-white dark:bg-gray-900 p-6">
      {icon && (
        <div className="absolute top-3 right-3 rounded-full bg-gray-100 dark:bg-gray-800 p-2">
          <div className="text-gray-400 dark:text-gray-500 [&>svg]:h-4 [&>svg]:w-4">
            {icon}
          </div>
        </div>
      )}
      <div className="space-y-1 pr-12">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-3xl font-bold tracking-tight text-black dark:text-white">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

interface Next2025ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Next2025Button({ 
  children, 
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className,
  ...props 
}: Next2025ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    primary: "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-5 text-base",
    lg: "h-14 px-8 text-lg",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface Next2025InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Next2025Input({ label, error, className, ...props }: Next2025InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <input
        className={cn(
          "flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}

interface Next2025ListItemProps {
  title: string;
  subtitle?: string;
  value?: string | number;
  icon?: ReactNode;
  badge?: ReactNode;
  onClick?: () => void;
}

export function Next2025ListItem({ 
  title, 
  subtitle, 
  value, 
  icon, 
  badge,
  onClick 
}: Next2025ListItemProps) {
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 rounded-lg border bg-card p-4 w-full text-left",
        onClick && "hover:bg-accent transition-colors cursor-pointer"
      )}
    >
      {icon && (
        <div className="flex-shrink-0 rounded-full bg-primary/10 p-2">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{title}</p>
        {subtitle && (
          <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
        )}
      </div>
      {badge && (
        <div className="flex-shrink-0">
          {badge}
        </div>
      )}
      {value !== undefined && (
        <div className="flex-shrink-0 text-lg font-bold">
          {value}
        </div>
      )}
    </Component>
  );
}

interface Next2025EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function Next2025EmptyState({ 
  icon, 
  title, 
  description, 
  action 
}: Next2025EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="mb-4 rounded-full bg-muted p-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground mb-6 max-w-sm">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}

interface Next2025LoadingProps {
  message?: string;
}

export function Next2025Loading({ message = "Carregando..." }: Next2025LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="mt-4 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
