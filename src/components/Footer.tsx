export default function Footer() {
  return (
    <footer className="py-10 px-6 text-center border-t border-[#E8F0FE]">
      <p className="text-sm text-[#9CA3AF]">
        © {new Date().getFullYear()} Lin.dev · Built with{' '}
        <span className="text-[#4A6CF7]">Astro</span> +{' '}
        <span className="text-[#7B61FF]">React</span> · Inspired by{' '}
        <span className="font-medium text-[#6B7280]">Toss</span>
      </p>
    </footer>
  );
}
