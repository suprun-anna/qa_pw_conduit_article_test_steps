import { expect, test } from '@playwright/test';

export class ArticlePage {
    constructor(page) {
        this.page = page;
        this.articleTitle = page.getByRole('heading', { level: 1 });
    }

    async assertTitleHasText(title) {
        await test.step(`Assert the title has text`, async () => {
            await expect(this.articleTitle).toHaveText(title);
        });
    }
}