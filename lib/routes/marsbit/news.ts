import { Route } from '@/types';
import got from '@/utils/got';
import timezone from '@/utils/timezone';
import { parseDate } from '@/utils/parse-date';

export const route: Route = {
    path: '/news',
    categories: ['finance'],
    example: '/marsbit/news',
    radar: [
        {
            source: ['marsbit.co'],
        },
    ],
    name: 'MarsBit - 24小时新闻',
    maintainers: ['colin4k'],
    handler,
    url: 'marsbit.co/',
};

async function handler() {
    const rootUrl = 'https://news.marsbit.co';

    const { data: response } = await got.post('https://api.marstelegram.com/info/news/recommend', {
        credentials: 'omit',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:129.0) Gecko/20100101 Firefox/129.0',
            Accept: '*/*',
            'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'cross-site',
            Priority: 'u=4',
        },
        body: 'lastDays=1&readCounts=50&newsCounts=6&lang=zh-CN',
        referrer: 'https://news.marsbit.co/',
        method: 'POST',
        mode: 'cors',
    });
    // console.log(response.obj.inforList);

    const items = response.obj.inforList.map((item) => ({
        title: item.title,
        link: `${rootUrl}/${item.id}.html`,
        pubDate: timezone(parseDate(item.publishTime), +8),
        //  updated: timezone(parseDate(item.dmodi_time), +8),
        description: item.synopsis,
        // image: { src: item.spic, alt: item.sabstract },
        author: item.author,
    }));
    // console.log(items);
    return {
        title: 'MarsBit - 24小时新闻',
        link: rootUrl,
        item: items,
    };
}
