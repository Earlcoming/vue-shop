<template>
    <div class="add">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{name: 'goods'}">商品列表</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 内容区域 -->
        <el-card>
            <el-alert title="商品提交信息" show-icon type="info" :closable="false" center></el-alert>

            <el-steps :space="200" :active=" +tabIndex" align-center finish-status="success">
                <el-step title="商品信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成提交"></el-step>
            </el-steps>

            <el-tabs tab-position="left" v-model="tabIndex" :before-leave="tabBeforeLeave" @tab-click="changeTab">
                <el-tab-pane label="商品信息" name="0">
                    <el-form ref="goodsFromRef" :rules="goodsFromRules" :model="goodsForm">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="goodsForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="goodsForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight" type="number">
                            <el-input v-model="goodsForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number" type="number">
                            <el-input v-model="goodsForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                                v-model="goodsForm.goods_cat"
                                :options="cateList"
                                :props="{ expandTrigger: 'hover', ...cateProp }"
                                @change="handleChange"
                                >
                            </el-cascader>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="1">
                    <div v-for="item in manyTableData" :key="item.attr_id" class="goodslist">
                        {{item.attr_name}}
                        <br>
                        <el-checkbox checked>{{item.attr_vals}}</el-checkbox>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="2">
                    <div v-for="items in tabSxattr" :key="items.attr_id" class="goodslist">
                        {{items.attr_name}}
                        <br>
                        <el-checkbox checked v-if="items.attr_vals !== ''">{{items.attr_vals}}</el-checkbox>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="3">
                    <el-upload
                    :action="uploadURL"
                    list-type="picture"
                    :headers="headerObj"
                    :on-success="onSuccess"
                    :on-remove="removePic"
                    >
                    <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="4">
                    <quill-editor v-model="goodsForm.goods_introduce">
                    </quill-editor>
                    <el-button type="primary" class="mt-20" @click="addGoods">添加商品</el-button>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
export default {
    name: '',
    data() {
        return {
            tabIndex: 0,
            goodsForm: {
                goods_name: '',
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                goods_cat: [],
                pics: [],
                goods_introduce: '',
                attrs: []
            },
            cateKeys: '',
            goodsFromRules: {
                goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
                goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
                goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
                goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
                goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
            },
            cateList: [],
            cateProp: {
                value: "cat_id",
                label: "cat_name",
                children: "children",
            },

            manyTableData: [],
            tabSxattr: [],
            uploadURL: 'http://timemeetyou.com:8889/api/private/v1/upload',
            headerObj: {
                Authorization: window.sessionStorage.getItem('token')
            }

        }
    },
    created() {
        this.getCateList();
    },
    computed: {
        catId() {
            return this.goodsForm.goods_cat[this.goodsForm.goods_cat.length - 1];
        }
    },
    methods: {
        // 获取商品分类
         async getCateList() {
            const { data: res } = await this.$http.get("categories");
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.cateList = res.data;
            this.$message.success(res.meta.msg);
        },
       
        // 页签切换之前
        tabBeforeLeave(activeName, oldName) {
            if(oldName === '0' && this.goodsForm.goods_cat.length !== 3) {
                this.$message.error('请选择商品分类');
                return false
                };
        },
        handleChange() {
            console.log(this.goodsForm.goods_cat)
        },
        async changeTab() {
            if(this.tabIndex === '1') {
                const {data: res} = await this.$http.get('categories/' + this.catId +'/attributes', {
                    params: {
                        sel: 'many'
                    }
                });
                if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
                this.manyTableData = res.data;
                this.$message.success(res.meta.msg);
            }else if(this.tabIndex === '2'){
                const {data: res} = await this.$http.get('categories/' + this.catId +'/attributes', {
                    params: {
                        sel: 'only'
                    }
                });
                if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
                this.tabSxattr = res.data;
                this.$message.success(res.meta.msg);
            }else if(this.tabIndex === '3') {
                
            }
        },
        onSuccess(res) {
            const picInfo = {pic: res.data.tmp_path};
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.goodsForm.pics.push(picInfo);
            console.log('上传图片',res, this.goodsForm.pics);
        }, 
        removePic(file) {
            const picPath = file.response.data.tmp_path;
            const i = this.goodsForm.pics.findIndex( x => x.pic === picPath);
            this.goodsForm.pics.splice(i, 1);
            console.log('删除图片', i,file, this.goodsForm);
        },
        addGoods() {
            this.$refs.goodsFromRef.validate(async valid => {
                if(!valid) return;
                this.goodsForm.goods_cat = this.goodsForm.goods_cat.join(',');
                // 动态属性添加到params中
                this.manyTableData.forEach( item => {
                    const newInfo = {
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals.join(' ')
                    };
                    this.goodsForm.attrs.push(newInfo);
                });
                // 静态属性添加到params中
                this.tabSxattr.forEach( item => {
                    const newInfo = {
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals
                    };
                    this.goodsForm.attrs.push(newInfo);
                })
                
                const {data: res} = await this.$http.post('goods', this.goodsForm);
                if(res.meta.status !== 201) return this.$message.error(res.meta.msg);
                this.$message.success(res.meta.msg);
            })
        }
    },
}
</script>

<style lang='sass' scoped>
.el-steps
    margin-top: 30px
    margin-bottom: 30px
.el-checkbox
    margin-top: 10px
    margin-bottom: 15px
.goodslist
    margin-bottom: 20px
    font-size: 14px
.mt-20
    margin-top: 20px
</style>