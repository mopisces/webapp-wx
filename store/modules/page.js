const state = () => ({
	pageWidth: null,
	pageHeight:null,
	//是否开启ucharts的canvas2d，开启后真机正常显示，微信开发工具显示错误
	openCanvas2d: false,
})

const getters = {
	pageWidth: (state) => state.pageWidth,
	pageHeight: (state) => state.pageHeight,
	openCanvas2d: (state) => state.openCanvas2d
}

const mutations = {
	setPageWidth( state, pageWidth ){
		state.pageWidth = pageWidth;
	},
	setPageHeight( state, pageHeight ){
		state.pageHeight = pageHeight;
	}
}

const actions = {
	setPageInfo({ commit }, sysInfo){
		const statusBarHeight = sysInfo.statusBarHeight || 0;
		const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
		const navBarHeight = menuButtonInfo.height + (menuButtonInfo.top - statusBarHeight) * 2;
		commit('setPageWidth', sysInfo.screenWidth);
		commit('setPageHeight', sysInfo.screenHeight - navBarHeight - 25);
	}
}

export default { state, getters, mutations, actions }