<template>
	<view class="">
		<u-picker-plus :show="show" ref="uPicker" :title="title" :showToolbar="showToolbar" :itemHeight="itemHeight"
			:cancelText="cancelText" :cancelColor="cancelColor" :confirmText="confirmText" :confirmColor="confirmColor"
			:loading="loading" :visibleItemCount="visibleItemCount" :defaultIndex="currIndexs" :columns="columns"
			:closeOnClickOverlay="closeOnClickOverlay" @confirm="confirm" @close="close" @cancel="cancel"
			@change="changeHandler" :showBottombar="showBottombar">
		</u-picker-plus>
	</view>
</template>
<script>
	import area from "../../province-city-county.json"
	import uPickerPlus from "../u-picker-plus/u-picker-plus.vue"
	export default {
		props: {
			show: {
				type: Boolean,
				default: () => false
			},
			closeOnClickOverlay: {
				type: Boolean,
				default: () => true
			},
			title: {
				type: String,
				default: () => ""
			},
			showToolbar: {
				type: Boolean,
				default: () => false
			},
			showBottombar: {
				type: Boolean,
				default: () => true
			},
			itemHeight: {
				type: [String, Number],
				default: () => 44
			},
			cancelText: {
				type: String,
				default: () => "取消"
			},
			cancelColor: {
				type: String,
				default: () => "#909193"
			},
			confirmText: {
				type: String,
				default: () => "确认"
			},
			confirmColor: {
				type: String,
				default: () => "#3c9cff"
			},
			visibleItemCount: {
				type: [String, Number],
				default: () => 5
			},
			loading: {
				type: Boolean,
				default: () => false
			},
			indexs: {
				type: Array,
				default: () => []
			},
			defaultIds: {
				type: Array,
				default: () => []
			},
			defaultNames: {
				type: Array,
				default: () => []
			},
			labelName: {
				type: String,
				default: () => 'name'
			},
			sourceData: {
				type: Array,
				default: () => area
			},
			initBack: {
				type: Boolean,
				default: () => true
			}
		},
		data() {
			return {
				currSourceData: this.sourceData,
				//展示数据
				columns: [],
				//层级，仅用做判断
				level: 0,
				currIndexs: this.indexs,
				currNames: this.defaultNames,
				currIds: this.defaultIds,
			}
		},
		watch: {
			indexs: function(newValue, oldValue) {
				this.defaultValChange(newValue, 1)
			},
			defaultNames: function(newValue, oldValue) {
				this.defaultValChange(newValue, 2)
			},
			defaultIds: function(newValue, oldValue) {
				this.defaultValChange(newValue, 3)
			},
			sourceData: function(newValue, oldValue) {
				this.defaultValChange(newValue, 4)
			},
		},
		mounted() {
			this.formatData();
			if (this.initBack) {
				this.initBackData();
			}
		},
		components: {
			uPickerPlus
		},
		methods: {
			changeHandler(e) {
				const {
					columnIndex,
					indexs,
					picker = this.$refs.uPicker
				} = e
				if (columnIndex === 0) {
					if (this.level == 2) {
						picker.setColumnValues(1, this.currSourceData[indexs[0]].children.map(v => v[this.labelName]))
					} else if (this.level == 3) {
						picker.setColumnValues(1, this.currSourceData[indexs[0]].children.map(v => v[this.labelName]))
						picker.setColumnValues(2, this.currSourceData[indexs[0]].children[indexs[1]].children.map(v => v[
							this
							.labelName]))
					}
				}
				if (columnIndex === 1 && this.level > 2) {
					picker.setColumnValues(2, this.currSourceData[indexs[0]].children[indexs[1]].children.map(v => v[this
						.labelName]))
				}
			},
			//处理异步回调数据改变重新渲染问题
			defaultValChange(newValue, changeType) {
				this.columns = []
				this.level = 0
				this.currIndexs = []
				this.currNames = []
				this.currIds = [];
				//indexs改变
				if (changeType == 1) {
					this.currIndexs = newValue
				}
				//name改变
				if (changeType == 2) {
					this.currNames = newValue
				}
				//id改变
				if (changeType == 3) {
					this.currIds = newValue;
				}
				//数据源改变
				if (changeType == 4) {
					this.currSourceData = newValue;
					this.currIndexs = this.indexs
					this.currNames = this.defaultNames
					this.currIds = this.defaultIds
				}
				this.formatData();
				if (this.initBack) {
					this.initBackData();
				}
			},
			formatData() {
				//如果没有传入默认值，则设置index[0,0,0]
				if ([this.currNames, this.currIndexs, this.currIds].every(arr => arr.length == 0)) {
					this.currIndexs = [0, 0, 0]
				}
				//优先级为：下标，名称，id
				if (this.currIndexs.length > 0) {
					this.initData(this.currIndexs, 0)
				} else if (this.currNames.length > 0) {
					this.initData(this.currNames, 1)
				} else if (this.currIds.length > 0) {
					this.initData(this.currIds, 2)
				}
			},
			confirm(e) {
				var chooseIds = [];
				var chooseObjs = [];
				let lv1Obj = this.currSourceData[e.indexs[0]];
				let lv1Id = this.currSourceData[e.indexs[0]].id;
				chooseIds.push(lv1Id);
				chooseObjs.push(lv1Obj);
				if (this.level > 1) {
					let lv2Obj = this.currSourceData[e.indexs[0]].children[e.indexs[1]];
					let lv2Id = this.currSourceData[e.indexs[0]].children[e.indexs[1]].id;
					chooseIds.push(lv2Id);
					chooseObjs.push(lv2Obj);
				}
				if (this.level > 2) {
					let lv3Obj = this.currSourceData[e.indexs[0]].children[e.indexs[1]].children[e.indexs[2]];
					let lv3Id = this.currSourceData[e.indexs[0]].children[e.indexs[1]].children[e.indexs[2]].id;
					chooseIds.push(lv3Id);
					chooseObjs.push(lv3Obj);
				}
				e.chooseIds = chooseIds;
				e.chooseObjs = chooseObjs;
				this.$emit("confirm", e)
			},
			initBackData() {
				var initValue = [];
				for (var i = 0; i < this.currIndexs.length; i++) {
					initValue.push(this.columns[i][this.currIndexs[i]])
				}
				var initData = {
					value: initValue,
					indexs: this.currIndexs,
					values: this.columns
				}
				this.confirm(initData);
			},
			close() {
				this.$emit("close")
			},
			open() {
				this.$emit("open")
				this.formatData()
			},
			cancel() {
				this.$emit("cancel")
			},

			//初始化数据
			initData(inPutArr, inpuType) {
				//第一层级
				if (inPutArr[0] != undefined) {
					this.level = 1;
					var arr = this.currSourceData.map(t => {
						return t[this.labelName]
					});
					this.columns.push(arr)
					if (inpuType == 1) {
						var currIndex = this.currSourceData.findIndex(item => item[this.labelName] == inPutArr[0]);
						this.currIndexs.push(currIndex)
					} else if (inpuType == 2) {
						var currIndex = this.currSourceData.findIndex(item => item.id == inPutArr[0]);
						this.currIndexs.push(currIndex)
					}
				}
				//第二层级
				if (inPutArr[1] != undefined) {
					this.level = 2;
					var level2Arr = this.currSourceData[this.currIndexs[0]].children
					var arr = level2Arr.map(t => {
						return t[this.labelName]
					})
					this.columns.push(arr)
					if (inpuType == 1) {
						console.log('根据defaultNames判断');
						var currIndex = level2Arr.findIndex(item => item[this.labelName] == inPutArr[1]);
						this.currIndexs.push(currIndex)
					} else if (inpuType == 2) {
						console.log('根据defaultIds判断');
						var currIndex = level2Arr.findIndex(item => item.id == inPutArr[1]);
						this.currIndexs.push(currIndex)
					}
				}
				if (inPutArr[2] != undefined) {
					this.level = 3;
					var level3Arr = this.currSourceData[this.currIndexs[0]].children[this.currIndexs[1]].children
					var arr = level3Arr.map(t => {
						return t[this.labelName]
					})
					this.columns.push(arr)
					if (inpuType == 1) {
						var currIndex = level3Arr.findIndex(item => item[this.labelName] == inPutArr[2]);
						this.currIndexs.push(currIndex)
					} else if (inpuType == 2) {
						var currIndex = level3Arr.findIndex(item => item.id == inPutArr[2]);
						this.currIndexs.push(currIndex)
					}
				}
			}
		}
	}
</script>
<style>

</style>