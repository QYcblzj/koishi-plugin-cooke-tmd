import axios from 'axios';

interface TranslateService {
  translate(text: string, toLanguage: string): Promise<string>;
}

const translateService: TranslateService = {
  async translate(text: string, toLanguage: string): Promise<string> {
    const primaryUrl = `https://api.jaxing.cc/v2/Translate/Tencent?SourceText=${encodeURIComponent(text)}&Target=${toLanguage}`;
    const backupUrl = `https://translate.cloudflare.jaxing.cc/?text=${encodeURIComponent(text)}&source_lang=zh&target_lang=${toLanguage}`;

    try {
      const response = await axios.get(primaryUrl);
      if (response.data && response.data.code === "ok" && response.data.data && response.data.data.Response) {
        const responseData = response.data.data.Response;
        if (responseData.Error) {
          // 主接口不支持该语种，直接尝试备用接口
          return await tryBackupTranslation(backupUrl);
        } else {
          return responseData.TargetText;
        }
      } else {
        // 有问题的话直接调用备用API
        return await tryBackupTranslation(backupUrl);
      }
    } catch (error) {
      // 有问题的话直接调用备用API
      return await tryBackupTranslation(backupUrl);
    }
  }
};

async function tryBackupTranslation(backupUrl: string): Promise<string> {
  try {
    const backupResponse = await axios.get(backupUrl);
    if (backupResponse.data && backupResponse.data.response) {
      const translatedText = backupResponse.data.response.translated_text;
      return translatedText;
    } else {
      throw new Error('Backup translation service did not return expected data.');
    }
  } catch (error) {
    throw new Error(`Backup translation service failed with error: ${error.message}`);
  }
}

export { translateService };