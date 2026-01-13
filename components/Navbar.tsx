"use client";
import React from "react";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { navItems } from "@/data/portfolio-data";

export const Navbar = () => {
  return (
    <div className="relative w-full">
      <FloatingNav navItems={navItems} />
    </div>
  );
};
