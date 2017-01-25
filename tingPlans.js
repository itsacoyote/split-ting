//With a calculated 5% grace overage on plans
var tingPlans = {
    minutes: {
        levels: [105, 525, 1050, 2205],
        plans: {
            S: 3,
            M: 9,
            L: 18,
            XL: 35,
            XXL: .019
        }
    },

    messages: {
        levels: [105, 1050, 2100, 5040],
        plans: {
            S: 3,
            M: 5,
            L: 8,
            XL: 11,
            XXL: .0025
        }
    },

    megabytes: {
        levels: [105, 525, 1051, 2099],
        plans: {
            S: 3,
            M: 10,
            L: 16,
            XL: 20,
            XXL: 10
        }
    }
};