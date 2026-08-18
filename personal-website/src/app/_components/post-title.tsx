import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export function PostTitle({ children }: Props) {
  return (
    <h1 className="text-[1.875rem] sm:text-[2.25rem] md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.35] mb-8 sm:mb-12 text-center">
      {children}
    </h1>
  );
}
