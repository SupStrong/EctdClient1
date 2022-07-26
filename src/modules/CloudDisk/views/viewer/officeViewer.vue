<template>
	<div class="cloud-disk-office-viewer">
		<windowHeader ref="windowHeader" :config="header" />
		<div class="container" :class="officeType">
			<iframe
				v-if="src"
				v-show="loadFinish"
				security="restricted"
				sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
				:src="src"
				frameborder="0"
				@load="loaded"
			></iframe>
			<template v-if="!loadFinish">
				<div class="logo" v-if="officeType === 'ppt'">
					<svg xmlns="http://www.w3.org/2000/svg" class="AppLogo" viewBox="0 0 180 180">
						<defs>
							<linearGradient id="a" x1="28.286" x2="70.714" y1="53.757" y2="127.243" gradientUnits="userSpaceOnUse">
								<stop offset="0" stop-color="#ca4c28"></stop>
								<stop offset=".5" stop-color="#c5401e"></stop>
								<stop offset="1" stop-color="#b62f14"></stop>
							</linearGradient>
						</defs>
						<path
							fill="#ed6c47"
							d="M96.85 99.85L85 98.07l-.62-.09-.13-.02-.47-.07-.28-.04-.31-.04-.44-.07-.15-.02-.6-.09L31 90a56.259 56.259 0 0 1 10.28-32c.06-.08.12-.17.17-.25s.12-.17.19-.25.12-.17.18-.25a2.348 2.348 0 0 1 .19-.25A56.363 56.363 0 0 1 87 34l8.38 56z"
						></path>
						<path fill="#ff8f6b" d="M144 90a56.5 56.5 0 0 0-56.5-56H87v56l27.032 8.7z"></path>
						<path
							fill="#d35230"
							d="M144 90v.5A56.492 56.492 0 0 1 45.25 128c-.3-.33-.59-.66-.87-1s-.56-.66-.83-1-.53-.66-.79-1-.51-.66-.76-1a56.259 56.259 0 0 1-11-33.5V90z"
						></path>
						<path
							d="M85 63v59.62a5.382 5.382 0 0 1-5.38 5.38H45.25c-.3-.33-.59-.66-.87-1s-.56-.66-.83-1-.53-.66-.79-1-.51-.66-.76-1a56.259 56.259 0 0 1-11-33.5V90a56.259 56.259 0 0 1 10.28-32c.06-.08.12-.17.17-.25s.12-.17.19-.25.12-.17.18-.25a2.348 2.348 0 0 1 .19-.25h37.61c2.97 0 5.38 3.03 5.38 6z"
							opacity=".05"
						></path>
						<path
							d="M84.25 63.1v58.52a5.3 5.3 0 0 1-5.29 5.38H44.38c-.29-.33-.56-.66-.83-1s-.53-.66-.79-1-.51-.66-.76-1a56.259 56.259 0 0 1-11-33.5V90a56.259 56.259 0 0 1 10.28-32c.06-.08.12-.17.17-.25s.12-.17.19-.25.12-.17.18-.25h37.05c2.97 0 5.38 2.87 5.38 5.85z"
							opacity=".075"
						></path>
						<path
							d="M83.5 63.19v57.43a5.223 5.223 0 0 1-5.19 5.38H43.55c-.27-.33-.53-.66-.79-1s-.51-.66-.76-1a56.259 56.259 0 0 1-11-33.5V90a56.259 56.259 0 0 1 10.28-32c.06-.08.12-.17.17-.25s.12-.17.19-.25h36.48a5.655 5.655 0 0 1 5.38 5.69z"
							opacity=".1"
						></path>
						<path
							d="M82.75 63.28v56.34a5.144 5.144 0 0 1-5.1 5.38H42.76c-.26-.33-.51-.66-.76-1a56.259 56.259 0 0 1-11-33.5V90a56.259 56.259 0 0 1 10.28-32c.06-.08.12-.17.17-.25h35.92a5.512 5.512 0 0 1 5.38 5.53z"
							opacity=".125"
						></path>
						<path
							d="M82 63.38v55.24a5.07 5.07 0 0 1-5 5.38H42a56.259 56.259 0 0 1-11-33.5V90a56.259 56.259 0 0 1 10.28-32h35.34A5.382 5.382 0 0 1 82 63.38z"
							opacity=".2"
						></path>
						<rect width="65" height="65" x="17" y="58" fill="url(#a)" rx="5.38"></rect>
						<path
							fill="#fff"
							d="M49.986 73.011q6.1 0 9.339 2.805t3.239 8.122a11.535 11.535 0 0 1-1.6 6.074 10.826 10.826 0 0 1-4.556 4.135 15.131 15.131 0 0 1-6.847 1.475h-6.48v12.367h-6.645V73.011zm-6.9 17.269H48.8a7.3 7.3 0 0 0 5.055-1.548 5.8 5.8 0 0 0 1.708-4.525q0-5.781-6.549-5.781h-5.933z"
						></path>
						<path fill="none" d="M0 0h180v180H0z"></path>
					</svg>
				</div>
				<div class="logo" v-else-if="officeType === 'word'">
					<svg xmlns="http://www.w3.org/2000/svg" class="AppLogo" viewBox="0 0 180 180">
						<defs>
							<linearGradient id="a" x1="28.286" x2="70.714" y1="53.757" y2="127.243" gradientUnits="userSpaceOnUse">
								<stop offset="0" stop-color="#2368c4"></stop>
								<stop offset=".5" stop-color="#1a5dbe"></stop>
								<stop offset="1" stop-color="#1146ac"></stop>
							</linearGradient>
						</defs>
						<path fill="#41a5ee" d="M138.62 34H52.38A5.38 5.38 0 0 0 47 39.38V62l50 9 47-9V39.38a5.38 5.38 0 0 0-5.38-5.38z"></path>
						<path fill="#2b7cd3" d="M144 62H47v28l49 10 48-10V62z"></path>
						<path fill="#185abd" d="M47 90v28l51 10 46-10V90H47z"></path>
						<path fill="#103f91" d="M52.381 147h86.238a5.381 5.381 0 0 0 5.381-5.381V118H47v23.619A5.381 5.381 0 0 0 52.381 147z"></path>
						<path d="M47 57v71h32.62a5.38 5.38 0 0 0 5.38-5.38V63c0-2.971-2.409-6-5.38-6z" opacity=".05"></path>
						<path d="M47 57.25V127h31.965a5.3 5.3 0 0 0 5.285-5.38V63.1c0-2.971-2.409-5.845-5.38-5.845z" opacity=".075"></path>
						<path d="M47 57.5V126h31.31a5.221 5.221 0 0 0 5.19-5.38V63.19a5.654 5.654 0 0 0-5.38-5.69z" opacity=".1"></path>
						<path d="M47 57.75V125h30.655a5.144 5.144 0 0 0 5.095-5.38V63.285a5.515 5.515 0 0 0-5.38-5.535z" opacity=".125"></path>
						<path d="M47 58v66h30a5.069 5.069 0 0 0 5-5.38V63.38A5.38 5.38 0 0 0 76.62 58z" opacity=".15"></path>
						<rect width="65" height="65" x="17" y="58" fill="url(#a)" rx="5.38"></rect>
						<path
							fill="#fff"
							d="M39.08 98.976q.159 1.245.208 2.171h.122q.072-.878.28-2.122t.4-2.1l5.659-24.416h7.317l5.855 24.051a34.986 34.986 0 0 1 .731 4.537h.1a34.521 34.521 0 0 1 .61-4.391l4.683-24.2h6.659l-8.2 34.978h-7.776l-5.586-23.167q-.243-1-.548-2.61t-.379-2.342h-.1q-.1.854-.378 2.537t-.451 2.488l-5.245 23.1h-7.9l-8.269-34.979h6.781l5.1 24.465q.169.756.327 2z"
						></path>
						<path fill="none" d="M0 0h180v180H0z"></path>
					</svg>
				</div>
				<div class="logo" v-else>
					<svg xmlns="http://www.w3.org/2000/svg" class="AppLogo" viewBox="0 0 180 180">
						<path fill="#21a366" d="M95 90h49V62l-51-2z"></path>
						<path fill="#21a366" d="M95 34H52.4c-3 0-5.4 2.4-5.4 5.4V62l50 3-2-31z"></path>
						<path fill="#185c37" d="M95 90L47 62v79.6c0 3 2.4 5.4 5.4 5.4h86.2c3 0 5.4-2.4 5.4-5.4V118L95 90z"></path>
						<path fill="#33c481" d="M138.6 34H95v28h49V39.4c0-3-2.4-5.4-5.4-5.4z"></path>
						<path fill="#107c41" d="M47 62h48v28H47zM95 90h49v28H95z"></path>
						<path fill="none" d="M0 0h180v180H0z"></path>
						<path d="M47 57v71h32.6c3 0 5.4-2.4 5.4-5.4V63c0-3-2.4-6-5.4-6H47z" opacity=".05"></path>
						<path d="M47 57.3V127h32c2.9 0 5.3-2.4 5.3-5.3V63.1c0-3-2.4-5.8-5.4-5.8H47z" opacity=".075"></path>
						<path d="M47 57.5V126h31.3c2.9 0 5.2-2.4 5.2-5.2V63.2c0-3-2.4-5.5-5.4-5.7H47z" opacity=".1"></path>
						<path d="M47 57.8V125h30.7c2.8 0 5.1-2.3 5.1-5.2V63.3c0-3-2.4-5.5-5.4-5.5H47z" opacity=".125"></path>
						<path d="M47 58v66h30c2.8 0 5-2.3 5-5.1V63.4c0-3-2.4-5.4-5.4-5.4H47z" opacity=".15"></path>
						<linearGradient
							id="SVGID_1_"
							x1="28.2859"
							x2="70.7141"
							y1="126.2432"
							y2="52.7568"
							gradientTransform="matrix(1 0 0 -1 0 180)"
							gradientUnits="userSpaceOnUse"
						>
							<stop offset="0" stop-color="#18884f"></stop>
							<stop offset=".5" stop-color="#117e43"></stop>
							<stop offset="1" stop-color="#0b6631"></stop>
						</linearGradient>
						<path
							fill="url(#SVGID_1_)"
							d="M22.4 58h54.2c3 0 5.4 2.4 5.4 5.4v54.2c0 3-2.4 5.4-5.4 5.4H22.4c-3 0-5.4-2.4-5.4-5.4V63.4c0-3 2.4-5.4 5.4-5.4z"
						></path>
						<path
							fill="#fff"
							d="M33.9 108l11.3-17.5L34.8 73h8.3l5.7 11.1c.5 1.1.9 1.8 1.1 2.4h.1c.4-.8.8-1.7 1.2-2.5l6.1-11H65L54.2 90.4 65.1 108H57l-6.5-12.2c-.3-.5-.6-1.1-.8-1.6h-.1c-.2.6-.4 1.1-.8 1.6L42.1 108h-8.2z"
						></path>
					</svg>
				</div>
				<p class="powered">Powered by Microsoft</p>
			</template>
		</div>
	</div>
</template>

<script>
export default {
	name: 'officeViewer',
	data() {
		return {
			src: null,
			header: {
				title: '',
				background: '#fff',
				color: '#6d6d6d',
			},
			officeType: 'doc',
			loadFinish: false,
		};
	},
	mounted() {
		if (this.$isElectron) {
			this.$ipc.on('win-data', (event, data) => {
				//接收打开office文件的数据
				this.init(data);
			});
		}
	},
	methods: {
		init(data) {
			this.$nextTick(() => {
				this.src = 'https://view.officeapps.live.com/op/view.aspx?src=' + this.$api.public.uploadUrl('disk', data.content);
				this.header.title = data.name;
				let extName = data.extName;
				if (['.doc', '.docx'].includes(extName)) {
					this.officeType = 'word';
				} else if (['.xls', '.xlsx'].includes(extName)) {
					this.officeType = 'excel';
				} else {
					this.officeType = 'ppt';
					this.header.background = '#393A3D';
					this.header.color = '#fff';
				}
			});
		},
		loaded(e) {
			this.loadFinish = true;
		},
	},
};
</script>

<style scoped lang="scss">
/*office窗口*/
.cloud-disk-office-viewer {
	width: 100%;
	height: 100%;
	background: #4e5255;
	display: flex;
	flex-direction: column;
	.container {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		flex: 1;
		.logo {
			width: 180px;
			text-align: center;
		}
		p {
			width: 100%;
			text-align: center;
			position: absolute;
			bottom: 10px;
			color: #6d6d6d;
		}
		&.ppt {
			background: #393a3d;
			iframe {
				height: calc(100% + 88px);
				margin-top: -88px;
			}
		}
		&.excel {
			background: #fff;
			iframe {
				height: calc(100% + 170px);
				margin-top: -170px;
			}
		}
		&.word {
			background: #fff;
		}
		iframe {
			width: 100%;
			height: calc(100% + 88px);
			margin-top: -88px;
		}
	}
}
</style>
