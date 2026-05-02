import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table, type TableColumn } from "./Table";

type User = {
	id: number;
	name: string;
	email: string;
	role: string;
};

// Sample data
const USERS: User[] = [
	{ id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
	{ id: 2, name: "Bob Smith", email: "bob@example.com", role: "Editor" },
	{
		id: 3,
		name: "Charlie Davis",
		email: "charlie@example.com",
		role: "Viewer",
	},
	{ id: 4, name: "Diana Lee", email: "diana@example.com", role: "Editor" },
	{ id: 5, name: "Ethan Patel", email: "ethan@example.com", role: "Viewer" },
	{ id: 6, name: "Fatima Khan", email: "fatima@example.com", role: "Admin" },
	{ id: 7, name: "George Liu", email: "george@example.com", role: "Viewer" },
	{ id: 8, name: "Hana Suzuki", email: "hana@example.com", role: "Editor" },
];

const columns: TableColumn<User>[] = [
	{ key: "id", header: "ID", sortable: true },
	{ key: "name", header: "Name", sortable: true },
	{ key: "email", header: "Email", sortable: true },
	{ key: "role", header: "Role", sortable: true },
];

const meta = {
	title: "Components/Table",
	component: Table,
	tags: ["autodocs"],
	args: {
		columns,
		data: USERS,
		filterPlaceholder: "Search users…",
		initialPageSize: 5,
		pageSizeOptions: [5, 10, 20],
		ariaLabel: "Users table",
	},
	render: (args) => (
		<div style={{ padding: "1.5rem", background: "#f8fafc" }}>
			<Table<User> {...args} />
		</div>
	),
} satisfies Meta<typeof Table<User>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/**
 * Story with more rows to showcase pagination behavior.
 */
const MANY_USERS: User[] = Array.from({ length: 42 }, (_, index) => {
	const i = index + 1;
	return {
		id: i,
		name: `User ${i}`,
		email: `user${i}@example.com`,
		role: i % 3 === 0 ? "Admin" : i % 2 === 0 ? "Editor" : "Viewer",
	};
});

export const ManyRows: Story = {
	args: {
		data: MANY_USERS,
		initialPageSize: 10,
		pageSizeOptions: [5, 10, 25, 50],
	},
};
