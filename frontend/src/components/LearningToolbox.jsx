export default function LearningToolbox({ actions, onClick }) {

    if (!actions?.length) return null;

    return (
        <div className="mt-5 border-t pt-4">

            <h3 className="text-sm font-semibold text-gray-500 mb-3">

                📦 Learning Toolbox

            </h3>

            <div className="flex flex-wrap gap-2">

                {actions.map((action) => (

                    <button
                        key={action.type}
                        onClick={() => onClick(action)}
                        className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-sm"
                    >
                        {action.title}
                    </button>

                ))}

            </div>

        </div>
    );
}