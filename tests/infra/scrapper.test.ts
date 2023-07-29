
import { Scrapper } from "../../src/infra/scrapper/Scrapper";

test("should read a invoice from pdf file", async () => {
    const wrapper = new Scrapper(__dirname + '/../contents/sample.pdf');
    await wrapper.parse();

    expect(wrapper.getRows().length).toBeGreaterThan(0);
    expect(wrapper.getNumberOfRows()).toEqual(wrapper.getRows().length);
    expect(wrapper.getNumberOfPages()).toEqual(1);
});
