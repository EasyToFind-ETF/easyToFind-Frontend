import localFont from 'next/font/local';

export const oneShinhan = localFont({
  src: [
    {
      path: '../../public/fonts/OneShinhan-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/OneShinhan-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/OneShinhan-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-one-shinhan',
});
