import { ChannelResponse } from "@/models/responses/channel-response";
import React from "react";

interface CreateChannelFormProps {

    onDelete: () => void;
    channel: ChannelResponse;
}

const CreateChannelForm: React.FC<CreateChannelFormProps> = ({ onDelete, channel }) => {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Create Channel</h2>
            <form className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Channel Name"
                    className="border border-gray-300 rounded-md p-2"
                />
                <textarea
                    placeholder="Channel Description"
                    className="border border-gray-300 rounded-md p-2"
                ></textarea>
                <button type="submit" className="bg-blue-500 text-white rounded-md p-2">
                    Create
                </button>
            </form>
            <button onClick={onDelete} className="text-red-500">
                Delete Channel
            </button>
        </div>
    );
};