module.exports = {
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '4000',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'andres-music.s3.eu-north-1.amazonaws.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: '*.s3.*.amazonaws.com',
          port: '',
          pathname: '/**',
        },
      ],
    },
    webpack(config, options) {
      const { isServer } = options;
      config.module.rules.push({
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        exclude: config.exclude,
        use: [
          {
            loader: require.resolve('url-loader'),
            options: {
              limit: config.inlineImageLimit,
              fallback: require.resolve('file-loader'),
              publicPath: `${config.assetPrefix}/_next/static/images/`,
              outputPath: `${isServer ? '../' : ''}static/images/`,
              name: '[name]-[hash].[ext]',
              esModule: config.esModule || false,
            },
          },
        ],
      });
  
      return config;
    },
  };
