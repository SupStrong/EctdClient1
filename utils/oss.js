import Vue from 'vue';
import OSS from 'ali-oss';

export function client() {
	var client = new OSS({
		region: 'oss-cn-beijing', //填写Bucket所在地域
		accessKeyId: 'LTAI5tSe1BZDK7mUvFQi3xmt',
		accessKeySecret: 'la8oUs0SwpM8MjFqDUO4MaH4ii8hcX',
		bucket: 'aliyun-wb-bvqq7ezi1t',
	}); //后端提供数据

	return client;
}
