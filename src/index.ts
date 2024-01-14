import { Context, Schema } from 'koishi';
import axios from 'axios';
import { translateService } from './translate-service';

export const name = 'recipe-tmd';

export const Config: Schema<Config> = Schema.object({
  apiKey: Schema.string().description('TheMealDB的API KEY,填1就好了').default('1').required(),
  enableTranslation: Schema.boolean().default(false).description('是否启用翻译功能'),
});

export const usage = `
<a href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=kW4Mvn1XZsfR_ghZfzdMK0-RlqvSlAFG&authKey=i%2ByfvnYw2qw9Y98RegxyacrannA8z9MEXQ9fICWZb%2FxCxN8atmjox399OWN%2BwR5%2F&noverify=0&group_code=778554862">
    <img src="https://image.newasp.com/attachment/article/2022/1204/093738_49079822.gif" alt="加入QQ群">
</a>
<br>
<a href="https://www.npmjs.com/package/koishi-plugin-cooke-tmd">    
    <img src="https://images.dmzj.com/resource/news/2022/12/15/1671089076233184.gif" height = 400 width = 400 alt="readme">
</a>
<a href="https://github.com/QYcblzj/koishi-plugin-cooke-tmd.git">
    <img src="https://ts1.cn.mm.bing.net/th/id/R-C.01e4232cb97564ec027f3d2639198b50?rik=iHSptn%2bndh0WrA&riu=http%3a%2f%2fwww.guangyuanol.cn%2fuploads%2fallimg%2f221212%2f2121243350-21.gif&ehk=1m%2f5kjGYhtTGbYl64BciehpzgZfoMgyIFT16IsZIKXk%3d&risl=&pid=ImgRaw&r=0" alt="star">
</a>
`

export interface Config {
  apiKey: string;
  enableTranslation: boolean;
}

export function apply(ctx: Context, { apiKey, enableTranslation }: Config) {
  ctx.command('cooke-tmd <query>', 'Search for recipes by name or ingredients')
    .alias('菜谱')
    .option('ingredients', '-i [ingredients:string]')
    .option('category', '-c [category:string]')
    .option('area', '-a [area:string]')
    .option('random', '-r Get a random recipe')
    .action(async ({ options }, query) => {
      if (options.random) {
        // 获取随机食谱
        return getRandomRecipe(apiKey);
      } else if (!query) {
        return '请输入您要搜索的食谱名称、原料、类别或地区。';
      }

      let ENquery = query;
      interface SearchParams {
        s?: string;
        i?: string;
        c?: string;
        a?: string;
      }

      if (enableTranslation) {
        try {
          ENquery = await translateService.translate(query, 'en');
        } catch (e) {
          console.error('Translation failed:', e);
          return '翻译查询时出现错误。';
        }
      }

      const params: SearchParams = { s: ENquery };
      if (options.ingredients) {
        params.i = options.ingredients;
      }
      if (options.category) {
        params.c = options.category;
      }
      if (options.area) {
        params.a = options.area;
      }

      try {
        const url = `https://www.themealdb.com/api/json/v1/${apiKey}/search.php`;
        const response = await axios.get(url, { params });
        const recipes = response.data.meals;

        if (recipes && recipes.length) {
          return formatRecipes(recipes);
        } else {
          return '没有找到相关食谱。';
        }
      } catch (error) {
        console.error('TheMealDB API Request failed:', error);
        return '搜索食谱时出现错误。';
      }
    });

  ctx.command('list-categories', 'List all meal categories')
    .action(async () => {
      try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/${apiKey}/categories.php`);
        const categories = response.data.categories;
        return categories.map(category => category.strCategory).join(', ');
      } catch (error) {
        console.error('TheMealDB API Request failed:', error);
        return '获取食谱类别时出现错误。';
      }
    });

  async function getRandomRecipe(apiKey) {
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/${apiKey}/random.php`);
      const randomRecipe = response.data.meals[0];
      return formatRecipes([randomRecipe]);
    } catch (error) {
      console.error('TheMealDB API Request failed:', error);
      return '获取随机食谱时出现错误。';
    }
  }

  function formatRecipes(recipes) {
    return recipes.map(recipe => {
        if (typeof recipe.strMealThumb !== 'string') {
            console.warn(`Expected strMealThumb to be a string, but got:`, recipe.strMealThumb);
            // 处理 recipe.strMealThumb 不是字符串的情况
        }
        const imageUrl = `${recipe.strMealThumb}/preview`;
        const image = `<img src="${imageUrl}">`; // 确保 URL 被引号包围
        return `${recipe.strMeal} - 查看详情: ${recipe.strSource}\n图片:${image}`;
    }).join('\n');
}
}