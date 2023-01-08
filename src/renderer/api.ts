async function getMacOSIcons(app: string) {
  const queryApp = app
    .split(' ')
    .map((i) => i.replace(/[0-9]|RP|OCR+/g, ''))
    .filter((i) => i)
    .join(',');
  const res = await fetch(
    'https://p1txh7zfb3-1.algolianet.com/1/indexes/macOSicons/query?x-algolia-agent=Algolia%20for%20JavaScript%20(4.13.1)%3B%20Browser',
    {
      headers: {
        accept: '*/*',
        'accept-language': 'en,zh-CN;q=0.9,zh;q=0.8',
        'content-type': 'application/x-www-form-urlencoded',
        'sec-ch-ua':
          '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'x-algolia-api-key': '0ba04276e457028f3e11e38696eab32c',
        'x-algolia-application-id': 'P1TXH7ZFB3',
      },
      referrer: 'https://macosicons.com/',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: `{"query":"${queryApp}","filters":"approved:true","hitsPerPage":25,"page":0}`,
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
    }
  );
  return (await res.json()).hits.map((i: any) => ({
    ...i,
    src: i.lowResPngUrl,
    name: i.appName,
  }));
}

export { getMacOSIcons };
