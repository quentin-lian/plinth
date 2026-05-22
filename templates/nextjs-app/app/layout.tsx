export const metadata = {
  title: 'bitfe Next.js Template',
  description: 'Starter template wired with @bitfe configs.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
