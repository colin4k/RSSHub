import { Route } from '@/types';
import got from '@/utils/got';
import timezone from '@/utils/timezone';
import { parseDate } from '@/utils/parse-date';
import dayjs from 'dayjs';

export const route: Route = {
    path: '/article',
    categories: ['finance'],
    example: '/techflowpost/article',
    radar: [
        {
            source: ['techflowpost.com/article/index.html'],
        },
    ],
    name: '深潮精选',
    maintainers: ['colin4k'],
    handler,
    url: 'techflowpost.com/',
};

async function handler(ctx) {
    const rootUrl = 'https://www.techflowpost.com';
    const currentUrl = `${rootUrl}/article/index.html`;

    const { data: response } = await got.post('https://www.techflowpost.com/ashx/index.ashx', {
        form: {
            pageindex: 1,
            pagesize: ctx.req.query('limit') ?? 10,
            time: dayjs().format('YYYY/M/D HH:mm:ss'),
        },
    });
    // console.log(response);

    const items = response.content.map((item) => ({
        title: item.stitle,
        link: `${rootUrl}/article/detail_${item.narticle_id}.html`,
        pubDate: timezone(parseDate(item.dcreate_time), +8),
        //  updated: timezone(parseDate(item.dmodi_time), +8),
        description: item.scontent,
        image: { src: item.spic, alt: item.sabstract },
    }));
    // console.log(items);
    return {
        title: '深潮TechFlow - 精选',
        link: currentUrl,
        item: items,
    };
}
