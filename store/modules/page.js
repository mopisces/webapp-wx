const state = () => ({
	pageWidth: null,
	pageHeight:null,
	/* 骨架屏幕配置 */
	skeleton: {
		rowNum: 14,
		rowHeight: 43.2
	},
})

const getters = {
	pageWidth: (state) => state.pageWidth,
	pageHeight: (state) => state.pageHeight,
	skeletonRowNum: (state) => state.skeleton.rowNum,
	skeletonRowHeight: (state) => state.skeleton.rowHeight,
}

const mutations = {
	setPageWidth( state, pageWidth ){
		state.pageWidth = pageWidth;
	},
	setPageHeight( state, pageHeight ){
		state.pageHeight = pageHeight;
	},
	setSkeletonRowNum( state ) {
		state.skeleton.rowNum = state.pageHeight / state.skeleton.rowHeight
	}
}

const actions = {
	async setPageInfo({ commit }, sysInfo){
		const statusBarHeight = sysInfo.statusBarHeight || 0;
		const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
		const navBarHeight = menuButtonInfo.height + (menuButtonInfo.top - statusBarHeight) * 2;
		await commit('setPageWidth', sysInfo.screenWidth);
		await commit('setPageHeight', sysInfo.screenHeight - navBarHeight - 25);
		await commit('setSkeletonRowNum')
	}
}

export default { state, getters, mutations, actions }