import createMDX from '@next/mdx';

module.exports = {
  images: {
    domains: ['i.imgur.com'], // Add i.imgur.com to the list of allowed domains
  },
}


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
