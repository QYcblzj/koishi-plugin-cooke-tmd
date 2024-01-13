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
    <img src="https://tse2-mm.cn.bing.net/th/id/OIP-C.oDYdzPVEBcXZn_MRsHk2BQAAAA?rs=1&pid=ImgDetMain" alt="加入QQ群">
</a>
<a href="https://www.npmjs.com/package/koishi-plugin-cooke-tmd">    
    <img src="https://tse4-mm.cn.bing.net/th/id/OIP-C.FQvt-4fgWsCF9tXQM78nWAHaHB?rs=1&pid=ImgDetMain" alt="readme">
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
      const imageUrl = `${recipe.strMealThumb}/preview`;
      return `${recipe.strMeal} - 查看详情: ${recipe.strSource}\n图片:[CQ:image,file=${imageUrl}]`;
    }).join('\n');
  }
}