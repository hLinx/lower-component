const STRATEGY_MAP = {
    'async': function (callback) {
        setTimeout(() => callback())
    },
    'viewport': function (callback) {
        const windowHeight = window.innerHeight
        const check = () => {
            const { top } = this.$refs['lowerComponent'].getBoundingClientRect()
            if (windowHeight + 30 >= top) {
                callback()
                clearTimeout(this.timer)
            }
            this.timer = setTimeout(() => {
                check()
            }, 100)
        }
        check()
        this.$once('hook:beforeDestroy', () => {
            clearTimeout(this.timer)
        })
    }
}
export default {
    name: 'lower-component',
    props: {
        level: {
            type: String,
            default: 'async'
        },
        custom: {
            type: [Function, Boolean],
            default: () => Promise.resolve()
        }
    },
    data () {
        return {
            isRender: false
        }
    },
    mounted() {
        if (this.level === 'custom') {
            if (typeof this.custom === 'function') {
                const customPromise = this.custom()
                if (process.env.NODE_ENV !== 'production') {
                    if (typeof customPromise.then !== 'function') {
                        throw new Error('当custom是函数类型时，custom必须返回一Promise')
                    }
                }
                customPromise.then(() => {
                    this.updateLevel()
                })
                return
            }
            const unwatch = this.$watch(() => this.custom, (newVal) => {
                if (newVal) {
                    this.updateLevel()
                    this.$nextTick(() => {
                        unwatch()
                    })
                }
            }, {
                immediate: true
            })
            return
        }
        if (process.env.NODE_ENV !== 'production') {
            if (!STRATEGY_MAP.hasOwnProperty(this.level)) {
                throw new Error('不支持的升级策略')
            }
        }
        STRATEGY_MAP[this.level].call(this, this.updateLevel)
    },
    methods: {
        updateLevel () {
            this.isRender = true
        }
    },
    render (h) {
        if (this.isRender) {
            if (this.$slots.default) {
                return this.$slots.default[0]
            }
            return this._e()
        }
        if (this.level === 'viewport') {
            return h('div', {
                ref: 'lowerComponent'
            })
        }
        return this._e()
    }
}