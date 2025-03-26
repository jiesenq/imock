// 解决 tslint 识别.vue 文件问题
// vue-shims.d.ts
declare module "*.vue" {
    import Vue from 'vue';
    export default Vue;
}