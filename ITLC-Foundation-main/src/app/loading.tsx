export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-[#dff0e6]">
      <div className="relative w-10 h-10 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-3 border-[#168039]/20 border-t-[#168039] animate-spin" />
      </div>
      <p className="mt-3 text-[11px] font-semibold tracking-widest text-[#0f5b9e] uppercase animate-pulse font-headline">
        Loading...
      </p>
    </div>
  );
}
