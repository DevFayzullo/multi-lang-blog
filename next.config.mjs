import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
