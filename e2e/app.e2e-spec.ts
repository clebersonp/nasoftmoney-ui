import { NasoftmoneyUiPage } from './app.po';

describe('nasoftmoney-ui App', () => {
  let page: NasoftmoneyUiPage;

  beforeEach(() => {
    page = new NasoftmoneyUiPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
