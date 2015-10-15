
var config = {
    // ��������
    alias: {
        'json': 'json',
        'jquery': 'jquery',
        'DDTree': 'DDTree/DDTree'
    },

    // ·������
    paths: {
        'gallery': 'https://a.alipayobjects.com/gallery'
    },

    // ��������
    vars: {
        'locale': 'zh-cn'
    },



    // Ԥ������
    preload: [
        this.JSON ? '' : 'json'
  ],

    // ����ģʽ
    debug: true,

    // Sea.js �Ļ���·��
    base: '/project/js/',

    // �ļ�����
    charset: 'utf-8'
}

seajs.config(config);

