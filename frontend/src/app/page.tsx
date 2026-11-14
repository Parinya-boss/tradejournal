type FeatureCardProps = {
  title: string;
  description: string;
};

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="rounded-x1 border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt2 text-sm text-slate-300">{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
          Trade Journal
        </p>

        <h1 className="mt-4 text-4xl font-bold">บันทึกการเทรดของคุณ</h1>

        <p className="mt-4 text-slate-300">
          จัดการบัญชีและติดตามรายการฝากถอนได้ในที่เดียว
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <FeatureCard
            title="บัญชีเทรด"
            description="ดูข้อมูลบัญชีเทรดของคุณ"
          />

          <FeatureCard
            title="ฝากและถอน"
            description="ติดตามรายการฝากและถอนของคุณ"
          />
        </div>
      </div>
    </main>
  );
}
