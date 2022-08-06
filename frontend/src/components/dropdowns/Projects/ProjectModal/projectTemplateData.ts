export const projectTemplate: any = {
    label: 'Project Template',
    value: 'project-template',
    children: [
        {
            label: "Software development",
            value: "software-development",
            descText: 'Plan, track and release great software. Get up and running quickly with templates that suit the way your team works. Plus, integrations for DevOps teams that want to connect work across their entire toolchain.',
            children: [
                {
                    label: 'Kanban',
                    value: 'kanban',
                    children: [],
                    caption: 'Visualize and advance your project forward using issues on a powerful board.',
                    leftBsIcon: '1-square',
                    info: {
                        descText: 'Kanban (the Japanese word for "visual signal") is all about helping teams visualize their work, limit work currently in progress, and maximize efficiency. Use the Kanban template to increase planning flexibility, reduce bottlenecks and promote transparency throughout the development cycle.',
                        item: []
                    },
                    viewType: 'templateInfo'
                },
                {
                    label: 'Scrum',
                    value: 'scrum',
                    children: [],
                    leftBsIcon: '2-square',
                    info: {
                        descText: 'The Scrum template helps teams work together using sprints to break down large, complex projects into bite-sized pieces of value. Encourage your team to learn through incremental delivery, self-organize while working on a problem, and regularly reflect on their wins and losses to continuously improve.',
                        item: [
                            {
                                label: 'Plan upcoming work in a backlog',
                                descText: "Prioritize and plan your team's work on the backlog. Break down work from your project roadmap, and order work items so your team knows what to deliver first.",
                                learnMoreLabel: 'Learn more about the backlog',
                                learnMoreTo: '#'
                            },
                            {
                                label: 'Organize cycles of work into sprints',
                                descText: "Sprints are short, time-boxed periods when a team collaborates to complete a set amount of customer value. Use sprints to drive incremental delivery, allow your team to ship high-quality work and deliver value faster.",
                                learnMoreLabel: 'Learn more about sprints',
                                learnMoreTo: '#'
                            },
                            {
                                label: 'Understand your team’s velocity',
                                descText: "Improve predictability on planning and delivery with out-of-the-box reports, including the sprint report and velocity chart. Empower your team to understand their capacity and iterate on their processes.",
                                learnMoreLabel: 'Learn more about agile metrics',
                                learnMoreTo: '#'
                            }
                        ]
                    },
                    viewType: 'templateInfo'
                }
            ],
            viewType: 'templateCard'
        },
        {
            label: "Service management",
            value: "service-management",
            children: [
                {
                    label: 'IT Service Management',
                    value: 'it-service-management',
                    children: [],
                    viewType: 'templateInfo'
                }
            ],
            viewType: 'templateCard'
        },
        {
            label: "Work management",
            value: "work-management",
            viewType: 'templateCard'
        }
    ]
}