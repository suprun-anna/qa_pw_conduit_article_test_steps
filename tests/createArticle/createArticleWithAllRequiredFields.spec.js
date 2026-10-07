import { test } from '@playwright/test';
import { SignUpPage } from '../../src/pages/SignUpPage';
import { HomePage } from '../../src/pages/HomePage';
import { CreateArticlePage } from '../../src/pages/CreateArticlePage';
import { ArticlePage } from '../../src/pages/ArticlePage';
import { faker } from '@faker-js/faker';

let homePage;
let createArticlePage;
let articlePage;

const article = {
    title: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    body: faker.lorem.paragraph(),
    tag: faker.lorem.word(),
};


test.beforeEach(async ({ page }) => {
    const signUpPage = new SignUpPage(page);
    articlePage = new ArticlePage(page);
    homePage = new HomePage(page);
    createArticlePage = new CreateArticlePage(page);

    const user = {
        username: `${faker.person.firstName()}_${faker.person.lastName()}`,
        email: faker.internet.email(),
        password: faker.internet.password(),
    };

    await signUpPage.open();
    await signUpPage.fillUsernameField(user.username);
    await signUpPage.fillEmailField(user.email);
    await signUpPage.fillPasswordField(user.password);
    await signUpPage.clickSignUpButton();
    await homePage.assertYourFeedTabIsVisible();
});

test('Create an article with all required fields', async () => {
    await homePage.clickNewArticleLink();

    await createArticlePage.fillTitleField(article.title);
    await createArticlePage.fillDescriptionField(article.description);
    await createArticlePage.fillBodyField(article.body);
    await createArticlePage.fillTagsField(article.tag);
    await createArticlePage.pressEnter();
    await createArticlePage.clickPublishArticleButton();

    await articlePage.assertTitleHasText(article.title);
});

test('Create an article without description', async () => {
    await homePage.clickNewArticleLink();

    await createArticlePage.fillTitleField(article.title);
    await createArticlePage.fillBodyField(article.body);
    await createArticlePage.fillTagsField(article.tag);
    await createArticlePage.pressEnter();
    await createArticlePage.clickPublishArticleButton();

    await createArticlePage.assertErrorMessageContainsText('Article description cannot be empty');
});

test('Create an article without body', async () => {
    await homePage.clickNewArticleLink();

    await createArticlePage.fillTitleField(article.title);
    await createArticlePage.fillDescriptionField(article.description);
    await createArticlePage.fillTagsField(article.tag);
    await createArticlePage.pressEnter();
    await createArticlePage.clickPublishArticleButton();

    await createArticlePage.assertErrorMessageContainsText('Article body cannot be empty');
});

test('Create an article without tags', async () => {
    await homePage.clickNewArticleLink();

    await createArticlePage.fillTitleField(article.title);
    await createArticlePage.fillDescriptionField(article.description);
    await createArticlePage.fillBodyField(article.body);
    await createArticlePage.clickPublishArticleButton();

    await articlePage.assertTitleHasText(article.title);
});
