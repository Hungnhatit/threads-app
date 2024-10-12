import React from 'react'

export const metadata = {
  title: "Sign in",
  description: "Sign in page",
};

export default function ViewSigninLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  )
}

