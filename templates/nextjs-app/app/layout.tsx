export const metadata = {
  title: 'plinth Next.js Template',
  description: 'Starter template wired with @plinth configs.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
