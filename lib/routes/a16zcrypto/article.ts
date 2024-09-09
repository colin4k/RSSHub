import { Route } from '@/types';
import ofetch from '@/utils/ofetch';
import cache from '@/utils/cache';
import { load } from 'cheerio';
import { parseDate } from '@/utils/parse-date';
const baseUrl = 'https://a16zcrypto.com/posts?format=listicles,papers-journals-whitepapers,article';
export const route: Route = {
    path: '/article',
    categories: ['finance'],
    example: '/a16zcrypto/article',
    radar: [
        {
            source: ['/a16zcrypto.com/posts?format=listicles,papers-journals-whitepapers,article'],
        },
    ],
    name: 'a16zcrypto Articles',
    maintainers: ['colin4k'],
    handler,
};
async function handler() {
    const response = await ofetch(baseUrl);
    const $ = load(response);
    const rootUrl = 'https://a16zcrypto.com';

    const list = $('.article-wrap section .article .row .col-sm-12.announcement-info-wrapper .row')
        .toArray()
        .slice(0, 40)
        .map((u) => {
            const $u = $(u);
            const item = {
                title: $u.find('.col-sm-9 a .item-title').text(),
                link: `${rootUrl}/${$u.find('.col-sm-9 a').attr('href')}`,
                pubDate: parseDate($u.find('.col-sm-3 .category-title').text().split(' / ')[0]),
                author: $u.find('.col-sm-9 a .sep-comma-and.posted-by span').text(),
            };
            return item;
        });
    const items = await Promise.all(
        list.map((item) =>
            cache.tryGet(item.link, async () => {
                const response = await ofetch(item.link);
                const $ = load(response);
                const urlList = $('.article-single.container #post-6-csx-talks-for-startups.article-right.noToc').first();
                const $u = $(urlList);
                item.description = $u.find('.post-block .wysiwyg').html();
                return item;
            })
        )
    );
    // console.log(items);
    return {
        title: 'a16zcrypto Articles',
        link: baseUrl,
        description: 'a16z crypto is a venture capital fund that invests in crypto and web3 startups.',
        item: items,
    };
}
