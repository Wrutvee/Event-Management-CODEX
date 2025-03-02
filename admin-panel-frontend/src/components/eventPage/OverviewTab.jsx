export default function OverviewTab({ eventData }) {
    return (
        <div className="prose max-w-none p-6">
            <p>{eventData.description}</p>
        </div>
    );
}